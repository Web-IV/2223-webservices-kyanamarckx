import express from 'express';
const Router = express.Router();

import { installReizigerRouter } from './_reiziger';
import { installBestemmingRouter } from './_bestemming';
import { installVervoersmiddelRouter } from './_vervoersmiddel';
import { installVerplaatsingRouter } from './_verplaatsing';
import { installHealthRouter } from './_health';

export function installRouters(app: any) {
  installReizigerRouter(Router);
  installBestemmingRouter(Router);
  installVervoersmiddelRouter(Router);
  installVerplaatsingRouter(Router);
  installHealthRouter(Router);

  app.use(Router.route('/api'));
}