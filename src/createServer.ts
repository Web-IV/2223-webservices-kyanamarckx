import * as dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import cors from 'cors';
import emoji from 'node-emoji';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { $log as logger } from "ts-log-debug";

import { ServiceError } from './core/serviceError';
import { installRoutes } from './rest/index';
import { reset } from '../prisma/reset';

import config from 'config';
import { seed } from '../prisma/seedTest';


const NODE_ENV = config.get('env');

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

logger.level = 'debug';
logger.name = 'Server';

const app = express();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'This Express API is written in TypeScript and uses Prisma ORM with a documentation from Swagger',
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const specs = swaggerJSDoc(options);

export default async function createServer() {
  const URL = config.get('serverUrl');
  const PORT: number = parseInt(process.env.PORT as string, 10);

  reset();

  app.use(express.json());
 
  app.use(async(ctx: any, _req: any, next: NextFunction) => {
    try {
      next();

      if (ctx.status === 404) {
        ctx.body = {
          code: "NOT_FOUND",
          message: "Unknown resource: " + ctx.url,
        };
      }
    } catch (error: any) {
      logger.error("Error occured while handling a request", { error: error, });

      let statusCode = error.status || 500;
      let errorBody = {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: error.message,
        details: error.details || {},
        stack: NODE_ENV === "production" ? undefined : error.stack,
      };  
 
      if (error instanceof ServiceError) {
        if(error.isNotFound) {
          statusCode = 404;
        }

        if(error.isValidationFailed) {
          statusCode = 400;
        }

        if(error.isUnauthorized) {
          statusCode = 401;
        }

        if(error.isForbidden) {
          statusCode = 403;
        }

        ctx.status = statusCode;
        ctx.body = errorBody;
      }
    }
  });

  app.use(async (ctx: any, _res: any, next: NextFunction) => {
    logger.info(`${emoji.get('rocket')} ${ctx.method} ${ctx.url}`);

    try {
      next();
    } catch (error) {
      logger.error(`${emoji.get('x')} ${ctx.method} ${ctx.status} ${ctx.url}`, {
        error,
      });
      throw error;
    }
  });
    
  app.use(cors());

  app.use(express.json());

  // app.get('/vacay.yaml', (req: Request, res: Response) => {
  //   res.setHeader('Content-Type', 'application/json');
  //   res.send(specs);
  // });

  // app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

  installRoutes(app);

  seed();


  return {
    getApp() {
      return app;
    },

    async start() {
      return new Promise<void>((resolve) => {
        //FOR RUNNING ALL TESTS AT ONCE: remove the 'port' from listen(port)
        app.listen(PORT);
        logger.info(`${emoji.get("sun_with_face")} Server running on ${URL}:${PORT}`);
        resolve();
      });
    },

    async stop() {
      app.removeAllListeners();
      new Promise<void>((resolve) => {
        app.listen(PORT).close(() => {
          logger.info(`${emoji.get("waning_crescent_moon")} Server stopped`);
          resolve();
        });
      });
    }
  };
};
