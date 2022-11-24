import * as Joi from 'joi';
import express from 'express';
const Router = express.Router();

const bestemmingService = require('../service/bestemming');

import { validate } from './_validation';

const getAllBestemmingen: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const bestemmingen = await bestemmingService.getAll();
  ctx.body = bestemmingen;
};
getAllBestemmingen.validationScheme = null;

const getBestemming: { (ctx: any): Promise<void>; validationScheme: any; } = async (ctx: any) => {
  const { id } = ctx.params;
  const bestemming = await bestemmingService.getBestemming(id);
  ctx.body = bestemming;
};
getBestemming.validationScheme = null;