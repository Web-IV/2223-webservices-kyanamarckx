import { bestemmingRouter } from "./bestemming";
import { reizigerRouter } from "./reiziger";
import { vervoersmiddelRouter } from "./vervoersmiddel";
import { verplaatsingRouter } from "./verplaatsing";
import express from "express";
const app = express();
export const installRoutes = (app: any) => {
  // app.use("/api", bestemmingRouter);
  // app.use("/api", reizigerRouter);
  // app.use("/api", vervoersmiddelRouter);
  // app.use("/api", verplaatsingRouter);

  app.use("/api/reizigers", reizigerRouter);
  app.use("/api/bestemmingen", bestemmingRouter);
  app.use("/api/vervoersmiddelen", vervoersmiddelRouter);
  app.use("/api/verplaatsingen", verplaatsingRouter);
};