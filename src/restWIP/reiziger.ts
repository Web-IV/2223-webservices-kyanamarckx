import express from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as ReizigerService from '../service/reiziger.service';

export const reizigerRouter = express.Router();

// GET: list of all Reizigers
reizigerRouter.get('/', async (req: Request, res: Response) => {
  try {
    const reizigers = await ReizigerService.listReizigers();
    logger.name = "Reiziger";
    logger.info(`${emoji.get('alien')}  Getting all travellers`);
    logger.name = "Server";
    return res.status(200).json(reizigers);
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting all travellers`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// GET: Reiziger by id
reizigerRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const reiziger = await ReizigerService.getReizigerById(id);
    if (reiziger) {
      logger.name = "Reiziger";
      logger.info(`${emoji.get('alien')}  Getting traveller with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(reiziger);
    }
    logger.name = "Reiziger";
    logger.warn(`${emoji.get('alien')}  Traveller with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Reiziger niet gevonden');
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting traveller with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

//POST: create a new Reiziger
// params: voornaam, naam, geboortedatum, stad, straat, huisnummer
reizigerRouter.post("/", 
body("voornaam").isString(), 
body("naam").isString(), 
body("geboortedatum").isString(), 
body("stad").isString(), 
body("straat").isString(), 
body("huisnummer").isString(), 
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while creating a new traveller`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const reiziger = req.body;
    const newReiziger = await ReizigerService.createReiziger(reiziger);
    logger.name = "Reiziger";
    logger.info(`${emoji.get('alien')}  Creating a new traveller`);
    logger.name = "Server";
    return res.status(201).json(newReiziger);
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while creating a new traveller`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// PUT: update a Reiziger
// params: voornaam, naam, geboortedatum, stad, straat, huisnummer
reizigerRouter.put("/:id",
body("voornaam").isString(),
body("naam").isString(),
body("geboortedatum").isString(),
body("stad").isString(),
body("straat").isString(),
body("huisnummer").isString(),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while updating traveller with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const reiziger = req.body;
    const updatedReiziger = await ReizigerService.updateReiziger(id, reiziger);
    logger.name = "Reiziger";
    logger.info(`${emoji.get('alien')}  Updating traveller with id ${id}`);
    logger.name = "Server";
    return res.status(200).json(updatedReiziger);
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while updating traveller with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Reiziger
reizigerRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await ReizigerService.deleteReiziger(id);
    logger.name = "Reiziger";
    logger.info(`${emoji.get('alien')}  Deleting traveller with id ${id}`);
    logger.name = "Server";
    return res.status(204).json("Reiziger werd succesvol verwijderd");
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while deleting traveller with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});
