import * as Joi from 'joi';
import express from 'express';
const Router = express.Router();

const verplaatsingService = require('../service/verplaatsing');

import { validate } from './_validation';

const getAllVerplaatsingen: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const verplaatsingen = await verplaatsingService.getAll();
  ctx.body = verplaatsingen;
};
getAllVerplaatsingen.validationScheme = null;

const getVerplaatsingById: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const verplaatsing = await verplaatsingService.getById(ctx.params.id);
  ctx.body = verplaatsing;
};
getVerplaatsingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

const createVerplaatsing: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const verplaatsing = await verplaatsingService.create(ctx.request.body);
  ctx.body = verplaatsing;
  ctx.status = 201;
};
createVerplaatsing.validationScheme = {
  body: {
    reiziger_id: Joi.number().integer().positive().required(),
    bestemming_id: Joi.number().integer().positive().required(),
    vervoersmiddel_id: Joi.number().integer().positive().required(),
  },
};

const updateVerplaatsing: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const verplaatsing = await verplaatsingService.update(ctx.params.id, ctx.request.body);
  ctx.body = verplaatsing;
};
updateVerplaatsing.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    reiziger_id: Joi.number().integer().positive().required(),
    bestemming_id: Joi.number().integer().positive().required(),
    vervoersmiddel_id: Joi.number().integer().positive().required(),
  },
};

const deleteVerplaatsing: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  await verplaatsingService.remove(ctx.params.id);
  ctx.status = 204;
};
deleteVerplaatsing.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

export function installVerplaatsingRouter(app: any) {
  Router.get('/', validate(getAllVerplaatsingen.validationScheme), getAllVerplaatsingen);
  Router.get('/:id', validate(getVerplaatsingById.validationScheme), getVerplaatsingById);
  Router.post('/', validate(createVerplaatsing.validationScheme), createVerplaatsing);
  Router.put('/:id', validate(updateVerplaatsing.validationScheme), updateVerplaatsing);
  Router.delete('/:id', validate(deleteVerplaatsing.validationScheme), deleteVerplaatsing);
  app.use(Router.route('/verplaatsingen'));
}