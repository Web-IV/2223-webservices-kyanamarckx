import express from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as BestemmingService from '../bestemming/bestemming.service';

export const bestemmingRouter = express.Router();

// GET: list of all Bestemmingen
bestemmingRouter.get('/', async (req: Request, res: Response) => {
  try {
    const bestemmingen = await BestemmingService.listBestemmingen();
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  Getting all destinations`);
    logger.name = "Server";
    return res.status(200).json(bestemmingen);
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  An error occurred while getting all destinations`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// GET: Bestemming by id
bestemmingRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const bestemming = await BestemmingService.getBestemmingById(id);
    if (bestemming) {
      logger.name = "Bestemming";
      logger.info(`${emoji.get('desert_island')}  Getting destination with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(bestemming);
    }
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  Destination with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Bestemming niet gevonden');
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  An error occurred while getting destination with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

//POST: create a new Bestemming
// params: land, stad, postcode
bestemmingRouter.post("/",
body("land").isString(),
body("stad").isString(),
body("postcode").isString(),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  An error occured while creating a new destination`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const bestemming = req.body;
    const newBestemming = await BestemmingService.createBestemming(bestemming);
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  Creating a new destination`);
    logger.name = "Server";
    return res.status(201).json(newBestemming);
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  An error occured while creating a new destination`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// PUT: update a Bestemming
// params: land, stad, postcode
bestemmingRouter.put("/:id",
body("land").isString(),
body("stad").isString(),
body("postcode").isString(),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  An error occured while updating destination with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const bestemming = req.body;
    const updatedBestemming = await BestemmingService.updateBestemming(id, bestemming);
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  Updating destination with id ${id}`);
    logger.name = "Server";
    return res.status(200).json(updatedBestemming);
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  An error occured while updating destination with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Bestemming
bestemmingRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await BestemmingService.deleteBestemming(id);
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  Deleting destination with id ${id}`);
    logger.name = "Server";
    return res.status(204).json("Bestemming werd succesvol verwijderd");
  } catch (error: any) {
    logger.name = "Bestemming";
    logger.info(`${emoji.get('desert_island')}  An error occured while deleting destination with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});