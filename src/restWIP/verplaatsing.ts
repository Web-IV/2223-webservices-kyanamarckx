import express from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as VerplaatsingService from '../service/verplaatsing.service';

export const verplaatsingRouter = express.Router();

// GET: list of all Verplaatsingen
verplaatsingRouter.get('/', async (req: Request, res: Response) => {
  try {
    const verplaatsingen = await VerplaatsingService.listVerplaatsingen();
    logger.name = "Verplaatsing";
    logger.info(`${emoji.get('round_pushpin')}  Getting all movements`);
    logger.name = "Server";
    return res.status(200).json(verplaatsingen);
  } catch (error: any) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while getting all movements`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// GET: Verplaatsing by id
verplaatsingRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const verplaatsing = await VerplaatsingService.getVerplaatsingById(id);
    if (verplaatsing) {
      logger.name = "Verplaatsing";
      logger.info(`${emoji.get('round_pushpin')}  Getting movement with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(verplaatsing);
    }
    logger.name = "Verplaatsing";
    logger.warn(`${emoji.get('round_pushpin')}  Movement with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Verplaatsing niet gevonden');
  } catch (error: any) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while getting movement with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

//POST: create a new Verplaatsing
// params: reiziger_id, bestemming_id, vervoersmiddel_id
verplaatsingRouter.post("/",
body("reiziger_id").isInt(),
body("bestemming_id").isInt(),
body("vervoersmiddel_id").isInt(),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while creating a new movement`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const verplaatsing = req.body;
    const newVerplaatsing = await VerplaatsingService.createVerplaatsing(verplaatsing);
    logger.name = "Verplaatsing";
    logger.info(`${emoji.get('round_pushpin')}  Creating a new movement`);
    logger.name = "Server";
    return res.status(201).json(newVerplaatsing);
  } catch (error: any) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while creating a new movement`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// PUT: update a Verplaatsing
// params: reiziger_id, bestemming_id, vervoersmiddel_id
verplaatsingRouter.put("/:id",
body("reiziger_id").isInt(),
body("bestemming_id").isInt(),
body("vervoersmiddel_id").isInt(),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while updating movement with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const verplaatsing = req.body;
    const updatedVerplaatsing = await VerplaatsingService.updateVerplaatsing(id, verplaatsing);
    if (updatedVerplaatsing) {
      logger.name = "Verplaatsing";
      logger.info(`${emoji.get('round_pushpin')}  Updating movement with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(updatedVerplaatsing);
    }
    logger.name = "Verplaatsing";
    logger.warn(`${emoji.get('round_pushpin')}  Movement with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Verplaatsing niet gevonden');
  } catch (error: any) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while updating movement with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Verplaatsing
verplaatsingRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await VerplaatsingService.deleteVerplaatsing(id);
    logger.name = "Verplaatsing";
    logger.info(`${emoji.get('round_pushpin')}  Deleting movement with id ${id}`);
    logger.name = "Server";
    return res.status(204).send("Verplaatsing werd sucessvol verwijderd");
  } catch (error: any) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while deleting movement with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});
