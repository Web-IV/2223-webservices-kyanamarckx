import * as Joi from 'joi';
import express from 'express';
const Router = express.Router();

const reizigerService = require('../service/reiziger');

import { validate } from './_validation';

const getAllReizigers: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const reizigers = await reizigerService.getAll();
  ctx.body = reizigers;
};
getAllReizigers.validationScheme = null;

const getReizigerById: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const reiziger = await reizigerService.getById(ctx.params.id);
  ctx.body = reiziger;
};
getReizigerById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

const createReiziger: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const reiziger = await reizigerService.create(ctx.request.body);
  ctx.body = reiziger;
  ctx.status = 201;
};
createReiziger.validationScheme = {
  body: {
    voornaam: Joi.string().max(255).required(),
    naam: Joi.string().max(255).required(),
    geboortedatum: Joi.string().min(10).max(10).required(),
    stad: Joi.string().max(255).required(),
    straat: Joi.string().max(255).required(),
    huisnummer: Joi.string().max(10).required(),
  },
};

const updateReiziger: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const reiziger = await reizigerService.update(ctx.params.id, ctx.request.body);
  ctx.body = reiziger;
};
updateReiziger.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
  body: {
    voornaam: Joi.string().max(255).required(),
    naam: Joi.string().max(255).required(),
    geboortedatum: Joi.string().min(10).max(10).required(),
    stad: Joi.string().max(255).required(),
    straat: Joi.string().max(255).required(),
    huisnummer: Joi.string().max(10).required(),
  },
};

const deleteReiziger: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  await reizigerService.remove(ctx.params.id);
  ctx.status = 204;
};
deleteReiziger.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

export function installReizigerRouter(app: any) {
  Router.get('/', validate(getAllReizigers.validationScheme), getAllReizigers);
  Router.get('/:id', validate(getReizigerById.validationScheme), getReizigerById);
  Router.post('/', validate(createReiziger.validationScheme), createReiziger);
  Router.put('/:id', validate(updateReiziger.validationScheme), updateReiziger);
  Router.delete('/:id', validate(deleteReiziger.validationScheme), deleteReiziger);

  app.use(Router.route('/reizigers'));
}