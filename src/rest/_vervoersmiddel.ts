import * as Joi from 'joi';
import express from 'express';
const Router = express.Router();

const vervoersmiddelService = require('../service/vervoersmiddel');

import { validate } from './_validation';

const getAllVervoersmiddelen: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const vervoersmiddelen = await vervoersmiddelService.getAll();
  ctx.body = vervoersmiddelen;
};
getAllVervoersmiddelen.validationScheme = null;

const getVervoersmiddelById: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const vervoersmiddel = await vervoersmiddelService.getById(ctx.params.id);
  ctx.body = vervoersmiddel;
};
getVervoersmiddelById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

const createVervoersmiddel: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const vervoersmiddel = await vervoersmiddelService.create(ctx.request.body);
  ctx.body = vervoersmiddel;
  ctx.status = 201;
};
createVervoersmiddel.validationScheme = {
  body: {
    type: Joi.string().max(255).required(),
  },
};

const updateVervoersmiddel: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const vervoersmiddel = await vervoersmiddelService.update(ctx.params.id, ctx.request.body);
  ctx.body = vervoersmiddel;
};
updateVervoersmiddel.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    type: Joi.string().max(255).required(),
  },
};

const deleteVervoersmiddel: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  await vervoersmiddelService.remove(ctx.params.id);
  ctx.status = 204;
};
deleteVervoersmiddel.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

export function installVervoersmiddelRouter(app: any) {
  Router.get('/', validate(getAllVervoersmiddelen.validationScheme), getAllVervoersmiddelen);
  Router.get('/:id', validate(getVervoersmiddelById.validationScheme), getVervoersmiddelById);
  Router.post('/', validate(createVervoersmiddel.validationScheme), createVervoersmiddel);
  Router.put('/:id', validate(updateVervoersmiddel.validationScheme), updateVervoersmiddel);
  Router.delete('/:id', validate(deleteVervoersmiddel.validationScheme), deleteVervoersmiddel);
  app.use(Router.route('/vervoersmiddelen'));
}