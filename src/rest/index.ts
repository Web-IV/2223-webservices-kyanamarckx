import express from 'express';
const Router = express.Router();

const installReizigerRouter = require('./_reiziger');
const installBestemmingRouter = require('./_bestemming');
const installVervoersmiddelRouter = require('./_vervoersmiddel');
const installVerplaatsingRouter = require('./_verplaatsing');
const installHealthRouter = require('./_health');

module.exports = (app: any) => {
  const router = express.Router();

  installReizigerRouter(router);
  installBestemmingRouter(router);
  installVervoersmiddelRouter(router);
  installVerplaatsingRouter(router);
  installHealthRouter(router);

  app.use('/api', router);
}