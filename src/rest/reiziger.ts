import express, { NextFunction } from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as ReizigerService from '../service/reiziger.service';
import { hasPermission } from '../core/auth';

export const reizigerRouter = express.Router();

// GET: list of all Reizigers
reizigerRouter.get('/', 
async (req: Request, res: Response) => {
  try {
    const reizigers = await ReizigerService.getReizigers();
    if (reizigers) {
      logger.name = "Reiziger";
      logger.info(`${emoji.get('alien')}  Getting all travellers`);
      logger.name = "Server";
      return res.status(200).json(reizigers);
    }
    logger.name = "Reiziger";
    logger.warn(`${emoji.get('alien')}  No travellers found`);
    logger.name = "Server";
    return res.status(404).json('Geen reizigers gevonden');
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting all travellers`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// GET: Reiziger by id
reizigerRouter.get('/:id', 
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting traveller with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
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

//GET: reiziger by auth0id
reizigerRouter.get('/auth0/:id',
param("id").isString().isLength({ min: 5, max: 255 }).withMessage("Id must be a string between 5 and 255 characters"),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: string = req.params.id;
  if (!errors.isEmpty()) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting traveller with auth0id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const reiziger = await ReizigerService.getReizigerByAuth0id(id);
    if (reiziger && reiziger.length > 0) {
      logger.name = "Reiziger";
      logger.info(`${emoji.get('alien')}  Getting traveller with auth0id ${id}`);
      logger.name = "Server";
      return res.status(200).json(reiziger);
    }
    logger.name = "Reiziger";
    logger.warn(`${emoji.get('alien')}  Traveller with auth0id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json(`Reiziger niet gevonden`);
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting traveller with auth0id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

//POST: create a new Reiziger
//params: voornaam, naam, geboortedatum, stad, straat, huisnummer, auth0id
reizigerRouter.post("/", 
body("voornaam").isString().isLength({ min: 1, max: 255 }).withMessage("Voornaam must be between 1 and 255 characters"),
body("naam").isString().isLength({ min: 1, max: 255 }).withMessage("Naam must be between 1 and 255 characters"),
body("geboortedatum").isString().isLength({ min: 10, max: 10 }).withMessage("Geboortedatum must be exact 10 characters (type: YYYY-MM-DD)"),
body("stad").isString().isLength({ min: 1, max: 255 }).withMessage("Stad must be between 1 and 255 characters"),
body("straat").isString().isLength({ min: 1, max: 255 }).withMessage("Straat must be between 1 and 255 characters"),
body("huisnummer").isString().isLength({ min: 1, max: 10 }).withMessage("Huisnummer must be between 1 and 10 characters"),
body("auth0id").isString().isLength({ min: 5, max: 255 }).withMessage("Auth0id must be between 5 and 255 characters"),

async (req: Request, res: Response) => {
  // const response = hasPermission(ctx, req, res, "write", next);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while creating a new traveller`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const reiziger = req.body;
    const newReiziger = await ReizigerService.register(reiziger);
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
// params: voornaam, naam, geboortedatum, stad, straat, huisnummer, auth0id
reizigerRouter.put("/:id",
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
body("voornaam").isString().isLength({ min: 1, max: 255 }).withMessage("Voornaam must be between 1 and 255 characters"),
body("naam").isString().isLength({ min: 1, max: 255 }).withMessage("Naam must be between 1 and 255 characters"),
body("geboortedatum").isString().isLength({ min: 10, max: 10 }).withMessage("Geboortedatum must be exact 10 characters (type: YYYY-MM-DD)"),
body("stad").isString().isLength({ min: 1, max: 255 }).withMessage("Stad must be between 1 and 255 characters"),
body("straat").isString().isLength({ min: 1, max: 255 }).withMessage("Straat must be between 1 and 255 characters"),
body("huisnummer").isString().isLength({ min: 1, max: 10 }).withMessage("Huisnummer must be between 1 and 10 characters"),
body("auth0id").isString().isLength({ min: 5, max: 255 }).withMessage("Auth0id must be between 5 and 255 characters"),
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
    if(updatedReiziger) {
      logger.name = "Reiziger";
      logger.info(`${emoji.get('alien')}  Updating traveller with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(updatedReiziger);
    }
    logger.name = "Reiziger";
    logger.warn(`${emoji.get('alien')}  Traveller with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Reiziger niet gevonden');    
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while updating traveller with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Reiziger
reizigerRouter.delete("/:id", 
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while deleting traveller with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
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