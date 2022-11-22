import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as BestemmingService from './bestemming.service';

export const bestemmingRouter = express.Router();

// GET: list of all Bestemmingen
bestemmingRouter.get('/', async (req: Request, res: Response) => {
  try {
    const bestemmingen = await BestemmingService.listBestemmingen();
    return res.status(200).json(bestemmingen);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: Bestemming by id
bestemmingRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const bestemming = await BestemmingService.getBestemmingById(id);
    if (bestemming) {
      return res.status(200).json(bestemming);
    }
    return res.status(404).json('Bestemming niet gevonden');
  } catch (error: any) {
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
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const bestemming = req.body;
    const newBestemming = await BestemmingService.createBestemming(bestemming);
    return res.status(201).json(newBestemming);
  } catch (error: any) {
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
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id: number = parseInt(req.params.id, 10);
  try {
    const bestemming = req.body;
    const updatedBestemming = await BestemmingService.updateBestemming(bestemming, id);
    return res.status(200).json(updatedBestemming);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Bestemming
bestemmingRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await BestemmingService.deleteBestemming(id);
    return res.status(204).json("Bestemming werd succesvol verwijderd");
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

