import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { reizigerRouter } from './reiziger/reiziger.router';
import { bestemmingRouter } from './bestemming/bestemming.router';
import { vervoersmiddelRouter } from './vervoersmiddel/vervoersmiddel.router';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/reizigers", reizigerRouter);
app.use("/api/bestemmingen", bestemmingRouter);
app.use("/api/vervoersmiddelen", vervoersmiddelRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})
