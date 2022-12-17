import express, { NextFunction } from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as BestemmingService from '../service/bestemming.service';
import { addUserInfo, hasPermission } from '../core/auth';

export const bestemmingRouter = express.Router();

// GET: list of all Bestemmingen
bestemmingRouter.get('/', 
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occurred while getting all destinations`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const bestemmingen = await BestemmingService.listBestemmingen();
    if (bestemmingen) {
      logger.name = "Bestemming";
      logger.info(`${emoji.get('desert_island')}  Getting all destinations`);
      logger.name = "Server";
      return res.status(200).json(bestemmingen);
    }
    logger.name = "Bestemming";
    logger.warn(`${emoji.get('desert_island')}  No destinations found`);
    logger.name = "Server";
    return res.status(404).json('Geen bestemmingen gevonden');
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occurred while getting all destinations`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// GET: Bestemming by id
bestemmingRouter.get('/:id', 
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occurred while getting destination with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const bestemming = await BestemmingService.getBestemmingById(id);
    if (bestemming) {
      logger.name = "Bestemming";
      logger.info(`${emoji.get('desert_island')}  Getting destination with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(bestemming);
    }
    logger.name = "Bestemming";
    logger.warn(`${emoji.get('desert_island')}  Destination with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Bestemming niet gevonden');
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occurred while getting destination with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

//POST: create a new Bestemming
// params: land, stad, postcode
bestemmingRouter.post("/",
body("land").isString().isLength({ min: 1, max: 255 }).withMessage("Land must be between 1 and 255 characters"),
body("stad").isString().isLength({ min: 1, max: 255 }).withMessage("Stad must be between 1 and 255 characters"),
body("postcode").isString().isLength({ min: 1, max: 10 }).withMessage("Postcode must be between 1 and 10 characters"),
async (req: Request, res: Response) => {
  
  // const user = ctx.auth.scope;
  // logger.debug(user);
  // const join = user;
  // logger.debug(join);
  // const response = hasPermission("write");
  // logger.debug(response);
  // if(response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occured while creating a new destination`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
    }
    try {
    const bestemming = req.body;
    // const reiziger = await UserService.getUserByAuth0id(ctx.auth.sub);
    // reizigerId = reiziger[0-36].id;
    
    const newBestemming = await BestemmingService.createBestemming(bestemming);
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  Creating a new destination`);
    logger.name = "Server";
    return res.status(201).json(newBestemming);
    } catch (error: any) {
    // await addUserInfo(ctx);
    // const name = ctx.auth.name;
    // const auth0id = ctx.auth.sub;
    // const id = Math.floor(Math.random() * 1000);
    // reizigerId = await UserService.register(
    //   id,
    //   name,
    //   auth0id,
    // );
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occured while creating a new destination`);
    logger.name = "Server";
    return res.status(500).json(error.message);
    }
  }  
);

// PUT: update a Bestemming
// params: land, stad, postcode
bestemmingRouter.put("/:id",
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
body("land").isString().isLength({ min: 1, max: 255 }).withMessage("Land must be between 1 and 255 characters"),
body("stad").isString().isLength({ min: 1, max: 255 }).withMessage("Stad must be between 1 and 255 characters"),
body("postcode").isString().isLength({ min: 1, max: 10 }).withMessage("Postcode must be between 1 and 10 characters"),
async (req: Request, res: Response) => {
  // const response = hasPermission(ctx, "write");
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occured while updating destination with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const bestemming = req.body;
    const updatedBestemming = await BestemmingService.updateBestemming(id, bestemming);
    if(updatedBestemming) {
      logger.name = "Bestemming";
      logger.info(`${emoji.get('desert_island')}  Updating destination with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(updatedBestemming);
    }
    logger.name = "Bestemming";
    logger.warn(`${emoji.get('desert_island')}  Destination with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Bestemming niet gevonden');    
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occured while updating destination with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Bestemming
bestemmingRouter.delete("/:id", 
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occured while deleting destination with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await BestemmingService.deleteBestemming(id);
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  Deleting destination with id ${id}`);
    logger.name = "Server";
    return res.status(204).json("Bestemming werd succesvol verwijderd");
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.error(`${emoji.get('desert_island')}  An error occured while deleting destination with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});
