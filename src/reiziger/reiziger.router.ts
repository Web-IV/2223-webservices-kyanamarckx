import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as ReizigerService from './reiziger.service';

export const reizigerRouter = express.Router();

// GET: list of all Reizigers
reizigerRouter.get('/', async (req: Request, res: Response) => {
  try {
    const reizigers = await ReizigerService.listReizigers();
    return res.status(200).json(reizigers);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: Reiziger by id
reizigerRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const reiziger = await ReizigerService.getReizigerById(id);
    if (reiziger) {
      return res.status(200).json(reiziger);
    }
    return res.status(404).json('Reiziger niet gevonden');
  } catch (error: any) {
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
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const reiziger = req.body;
    const newReiziger = await ReizigerService.createReiziger(reiziger);
    return res.status(201).json(newReiziger);
  } catch (error: any) {
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
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id: number = parseInt(req.params.id, 10);
  try {
    const reiziger = req.body;
    const updatedReiziger = await ReizigerService.updateReiziger(reiziger, id);
    return res.status(200).json(updatedReiziger);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Reiziger
reizigerRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await ReizigerService.deleteReiziger(id);
    return res.status(204).json("Reiziger werd succesvol verwijderd");
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
