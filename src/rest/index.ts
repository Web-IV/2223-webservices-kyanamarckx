import { bestemmingRouter } from "./bestemming";
import { reizigerRouter } from "./reiziger";
import { vervoersmiddelRouter } from "./vervoersmiddel";
import { verplaatsingRouter } from "./verplaatsing";

export const installRoutes = (app: any) => {
  app.use("/api/reizigers", reizigerRouter);
  app.use("/api/bestemmingen", bestemmingRouter);
  app.use("/api/vervoersmiddelen", vervoersmiddelRouter);
  app.use("/api/verplaatsingen", verplaatsingRouter);
};