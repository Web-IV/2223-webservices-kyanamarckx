import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as VerplaatsingService from '../verplaatsing/verplaatsing.service';

export const verplaatsingRouter = express.Router();

// GET: list of all Verplaatsingen
verplaatsingRouter.get('/', async (req: Request, res: Response) => {
  try {
    const verplaatsingen = await VerplaatsingService.listVerplaatsingen();
    return res.status(200).json(verplaatsingen);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: Verplaatsing by id
verplaatsingRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const verplaatsing = await VerplaatsingService.getVerplaatsingById(id);
    if (verplaatsing) {
      return res.status(200).json(verplaatsing);
    }
    return res.status(404).json('Verplaatsing niet gevonden');
  } catch (error: any) {
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
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const verplaatsing = req.body;
    const newVerplaatsing = await VerplaatsingService.createVerplaatsing(verplaatsing);
    return res.status(201).json(newVerplaatsing);
  } catch (error: any) {
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
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const verplaatsing = req.body;
    const id: number = parseInt(req.params.id, 10);
    const updatedVerplaatsing = await VerplaatsingService.updateVerplaatsing(id, verplaatsing);
    if (updatedVerplaatsing) {
      return res.status(200).json(updatedVerplaatsing);
    }
    return res.status(404).json('Verplaatsing niet gevonden');
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Verplaatsing
verplaatsingRouter.delete("/:id", async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    await VerplaatsingService.deleteVerplaatsing(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
