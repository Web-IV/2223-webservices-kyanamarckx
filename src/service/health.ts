// import { Context } from "express-validator/src/context";
//get package.json file
const json = require("../package.json");

// export default async function health(ctx: Response) {
//   ctx. = {
//     name: json.name,
//     version: json.version,
//     description: json.description,
//   };

export const ping = () => ({ pong: true })

export const getVersion = () => ({
  env: process.env.NODE_ENV,
  name: json.name,
  version: json.version,
});