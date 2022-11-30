import * as Joi from 'joi';
import express from 'express';
const Router = express.Router();
const app = express();

const bestemmingService = require('../service/bestemming');

import { validate } from './_validation';
import { installRouters } from '.';

const getAllBestemmingen: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const bestemmingen = await bestemmingService.getAll();
  ctx.body = bestemmingen;
};
getAllBestemmingen.validationScheme = null;

const getBestemmingById: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const { id } = ctx.params;
  const bestemming = await bestemmingService.getById(id);
  ctx.body = bestemming;
};
getBestemmingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

const createBestemming: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const bestemming = await bestemmingService.create(ctx.request.body);
  ctx.body = bestemming;
  ctx.status = 201;
};
createBestemming.validationScheme = {
  body: {
    land: Joi.string().max(255).required(),
    stad: Joi.string().max(255).required(),
    postcode: Joi.string().max(10).required(),
  },
};

const updateBestemming: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  // const { id } = ctx.params;
  const bestemming = await bestemmingService.update(ctx.params.id, ctx.request.body);
  ctx.body = bestemming;
};
updateBestemming.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    land: Joi.string().max(255).required(),
    stad: Joi.string().max(255).required(),
    postcode: Joi.string().max(10).required(),
  },
};

const deleteBestemming: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  // const { id } = ctx.params;
  await bestemmingService.remove(ctx.params.id);
  ctx.status = 204;
};
deleteBestemming.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

//TODO opletten om deze te importeren want in voorbeeld geen naam
export function installBestemmingRouter(router: express.Router) {
  
  router.get('/', getAllBestemmingen);
  router.get('/:id', validate(getBestemmingById.validationScheme), getBestemmingById);
  router.post('/', validate(createBestemming.validationScheme), createBestemming);
  router.put('/:id', validate(updateBestemming.validationScheme), updateBestemming);
  router.delete('/:id', validate(deleteBestemming.validationScheme), deleteBestemming);
  app.use('/bestemmingen', Router);
  // app.use(Router.route('/bestemmingen'));
  
  //getAllBestemmingen.initialize(app);
}