import express from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as VervoersmiddelService from '../vervoersmiddel/vervoersmiddel.service';

export const vervoersmiddelRouter = express.Router();

// GET: list of all Vervoersmiddelen
vervoersmiddelRouter.get('/', async (req: Request, res: Response) => {
  try {
    const vervoersmiddelen = await VervoersmiddelService.listVervoersmiddelen();
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  Getting all means of transport`);
    logger.name = "Server";
    return res.status(200).json(vervoersmiddelen);
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  An error occurred while getting all means of transport`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// GET: Vervoersmiddel by id
vervoersmiddelRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const vervoersmiddel = await VervoersmiddelService.getVervoersmiddelById(id);
    if (vervoersmiddel) {
      logger.name = "Vervoersmiddel";
      logger.info(`${emoji.get('taxi')}  Getting mean of transport with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(vervoersmiddel);
    }
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  Mean of transport with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Vervoersmiddel niet gevonden');
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  An error occurred while getting mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

//POST: create a new Vervoersmiddel
// params: type
vervoersmiddelRouter.post("/",
body("type").isString(),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  An error occurred while creating a new mean of transport`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const vervoersmiddel = req.body;
    const newVervoersmiddel = await VervoersmiddelService.createVervoersmiddel(vervoersmiddel);
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  Creating a new mean of transport`);
    logger.name = "Server";
    return res.status(201).json(newVervoersmiddel);
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  An error occurred while creating a new mean of transport`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// PUT: update a Vervoersmiddel
// params: type
vervoersmiddelRouter.put("/:id",
body("type").isString(),
async (req: Request, res: Response) => {
  const errors = validationResult(req); 
  const id = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  An error occurred while updating mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const vervoersmiddel = req.body;
    const updatedVervoersmiddel = await VervoersmiddelService.updateVervoersmiddel(id, vervoersmiddel);
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  Updating mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(200).json(updatedVervoersmiddel);
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  An error occurred while updating mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Vervoersmiddel
vervoersmiddelRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await VervoersmiddelService.deleteVervoersmiddel(id);
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  Deleting mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(204).send();
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  An error occurred while deleting mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});
