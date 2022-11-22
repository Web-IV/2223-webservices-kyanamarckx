import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as VervoersmiddelService from './vervoersmiddel.service';

export const vervoersmiddelRouter = express.Router();

// GET: list of all Vervoersmiddelen
vervoersmiddelRouter.get('/', async (req: Request, res: Response) => {
  try {
    const vervoersmiddelen = await VervoersmiddelService.listVervoersmiddelen();
    return res.status(200).json(vervoersmiddelen);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// GET: Vervoersmiddel by id
vervoersmiddelRouter.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  try {
    const vervoersmiddel = await VervoersmiddelService.getVervoersmiddelById(id);
    if (vervoersmiddel) {
      return res.status(200).json(vervoersmiddel);
    }
    return res.status(404).json('Vervoersmiddel niet gevonden');
  } catch (error: any) {
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
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const vervoersmiddel = req.body;
    const newVervoersmiddel = await VervoersmiddelService.createVervoersmiddel(vervoersmiddel);
    return res.status(201).json(newVervoersmiddel);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// PUT: update a Vervoersmiddel
// params: type
vervoersmiddelRouter.put("/:id",
body("type").isString(),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const id = parseInt(req.params.id, 10);
  try {
    const vervoersmiddel = req.body;
    const updatedVervoersmiddel = await VervoersmiddelService.updateVervoersmiddel(vervoersmiddel, id);
    return res.status(200).json(updatedVervoersmiddel);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

// DELETE: delete a Vervoersmiddel
vervoersmiddelRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  try {
    await VervoersmiddelService.deleteVervoersmiddel(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});
