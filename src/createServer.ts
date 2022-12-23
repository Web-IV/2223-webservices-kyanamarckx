import * as dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import cors from 'cors';
import emoji from 'node-emoji';
import swaggerUi from "swagger-ui-express";

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

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );

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
        app.listen().close(() => {
          logger.info(`${emoji.get("waning_crescent_moon")} Server stopped`);
          resolve();
        });
      });
    }
  };
};

