import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import emoji from 'node-emoji';
import fetch from 'node-fetch';

import { $log as logger } from "ts-log-debug";
import bodyParser from 'body-parser';

import { reizigerRouter } from './reiziger/reiziger.router';
import { bestemmingRouter } from './bestemming/bestemming.router';
import { vervoersmiddelRouter } from './vervoersmiddel/vervoersmiddel.router';
import { verplaatsingRouter } from './verplaatsing/verplaatsing.router';
import { ServiceError } from './core/serviceError';
import config from 'config';
const NODE_ENV = config.get('env');

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

logger.level = 'debug';
logger.name = 'Server';

export async function createServer() {
  const PORT: number = parseInt(process.env.PORT as string, 10);
  const app = express();

  app.use(async (ctx: any, next: any) => {
    logger.info(`${emoji.get('rocket')} ${ctx.url}`);

    const getStatusEmoji = () => {
      if (ctx.status >= 500) {
        return emoji.get('boom');
      }
      if (ctx.status >= 400) {
        return emoji.get('poop');
      }
      if (ctx.status >= 300) {
        return emoji.get('eyes');
      }
      if (ctx.status >= 200) {
        return emoji.get('rocket');
      }
      return emoji.get('rewind');
    };

    try {
      await next();

      logger.info(
        `${getStatusEmoji()} ${ctx.status} ${ctx.method} ${ctx.url} ${ctx.response.length}b sent`,
      )

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

  app.use(cors());
  app.use(express.json());
  app.use(bodyParser);
  app.use("/api/reizigers", reizigerRouter);
  app.use("/api/bestemmingen", bestemmingRouter);
  app.use("/api/vervoersmiddelen", vervoersmiddelRouter);
  app.use("/api/verplaatsingen", verplaatsingRouter);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        const port = process.env.PORT || 8000;
        app.listen(port);
        logger.info(`${emoji.get("sun_with_face")} Server running on http://localhost:${port}`);
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
}

