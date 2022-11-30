import express from 'express';
const Router = express.Router();


import { installReizigerRouter } from './_reiziger';
import { installBestemmingRouter } from './_bestemming';
import { installVervoersmiddelRouter } from './_vervoersmiddel';
import { installVerplaatsingRouter } from './_verplaatsing';
import { installHealthRouter } from './_health';

export function installRouters(router: express.Router) {
  const app = express();
  installReizigerRouter(router);
  installBestemmingRouter(router);
  installVervoersmiddelRouter(router);
  installVerplaatsingRouter(router);
  installHealthRouter(router);

  app.use('/api', router);
}