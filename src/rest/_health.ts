import express from 'express';
const Router = express.Router();

import * as healthService from '../service/health';

import { validate } from './_validation';

// const ping = async (ctx: any) => {
//   ctx.body = await healthService.ping();
// };

// const getVersion = async (ctx: any) => {
//   ctx.body = await healthService.getVersion();
// };

// export function installPlacesRoutes(app: any) {
//   Router.get('/ping', ping);
//   Router.get('/version', getVersion);
//   app.use(Router.route('/health'));
// }

const ping: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: { body: { pong: boolean; }; }) => {
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

const getVersion: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: {
    body: {
      env: string | undefined; //   Router.get('/ping', ping);
      name: any; version: any;
    };
  }) => {
  ctx.body = healthService.getVersion();
};
getVersion.validationScheme = null;


export function installHealthRouter(app: any) {
  Router.get('/ping', validate(ping.validationScheme), ping);
  Router.get('/version', validate(getVersion.validationScheme), getVersion);
  app.use(Router.route('/health'));
}
