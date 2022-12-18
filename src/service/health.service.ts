// import { Context } from "express-validator/src/context";
//get package.json file
// import * as json from '../../package.json';
const json = require("../../package.json");

export default async function health(ctx: any) {
  ctx.body = {
    name: json.name,
    version: json.version,
    description: json.description,
  };
  return ctx.body;
}

export const ping = () => ({ pong: true })

export const getVersion = () => ({
  env: process.env.NODE_ENV,
  name: json.name,
  version: json.version,
});