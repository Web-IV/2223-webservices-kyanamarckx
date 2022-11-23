import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { reizigerRouter } from './reiziger/reiziger.router';
import { bestemmingRouter } from './bestemming/bestemming.router';
import { vervoersmiddelRouter } from './vervoersmiddel/vervoersmiddel.router';
import { verplaatsingRouter } from './verplaatsing/verplaatsing.router';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const app = express();
const server = app.listen(PORT);

export function createServer() {
  app.use(cors());
  app.use(express.json());
  app.use("/api/reizigers", reizigerRouter);
  app.use("/api/bestemmingen", bestemmingRouter);
  app.use("/api/vervoersmiddelen", vervoersmiddelRouter);
  app.use("/api/verplaatsingen", verplaatsingRouter);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve, reject) => {
        app.listen(PORT, () => {
          console.log(`Server running on port http://localhost:${PORT}`);
          resolve();
        });
      });
    },

    stop() {
      app.removeAllListeners();
      return new Promise<void>((resolve, reject) => {
        server.close(() => {
          resolve();
        });
      });
    }
  };
}

