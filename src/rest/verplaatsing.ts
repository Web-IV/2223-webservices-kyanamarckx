import express from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as VerplaatsingService from '../service/verplaatsing.service';
import { checkJwt } from '../core/auth';
import { requiredScopes } from 'express-oauth2-jwt-bearer';

export const verplaatsingRouter = express.Router();


/**
 * @openapi
 * tags:
 *   name: Verplaatsingen
 *   description: Represents a Verplaatsing in the system
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Verplaatsing:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - reiziger_id
 *             - bestemming_id
 *             - vervoersmiddel_id
 *           properties:
 *             reiziger_id:
 *               type: "integer"
 *               minimum: 1
 *             bestemming_id:
 *               type: "integer"
 *               minimum: 1
 *             vervoersmiddel_id:
 *               type: "integer"
 *               minimum: 1
 *           example:
 *             $ref: "#/components/examples/Verplaatsing"
 *     VerplaatsingsList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Verplaatsing"
 *   examples:
 *     Verplaatsing:
 *       id: 123
 *       reiziger_id: 1
 *       bestemming_id: 2
 *       vervoersmiddel_id: 3
 */

let checkScopes = requiredScopes('read');

/**
 * @openapi
 * /api/verplaatsingen:
 *   get:
 *     summary: Get all verplaatsingen
 *     tags:
 *      - Verplaatsingen
 *     responses:
 *       200:
 *         description: List of verplaatsingen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VerplaatsingsList"
 */

// GET: list of all Verplaatsingen
verplaatsingRouter.get('/', 
checkJwt,
checkScopes,
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while getting all movements`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const verplaatsingen = await VerplaatsingService.listVerplaatsingen();
    const count = await VerplaatsingService.getVerplaatsingCount();
    if (verplaatsingen && count) {
      logger.name = "Verplaatsing";
      logger.info(`${emoji.get('round_pushpin')}  Getting all movements`);
      logger.name = "Server";
      const verplaatsingenWithCount = { count, verplaatsingen };
      return res.status(200).json(verplaatsingenWithCount);
    }
    logger.name = "Verplaatsing";
    logger.warn(`${emoji.get('round_pushpin')}  No movements found`);
    logger.name = "Server";
    return res.status(404).json('Geen verplaatsingen gevonden');
  } catch (error: any) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while getting all movements`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

/**
 * @openapi
 * /api/verplaatsingen:
 *   get:
 *     summary: Get count of all verplaatsingen
 *     tags:
 *      - Verplaatsingen
 *     responses:
 *       200:
 *         description: Count of verplaatsingen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VerplaatsingsList"
 */

// GET: Verplaatsing count
verplaatsingRouter.get('/count',
checkJwt,
checkScopes,
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while getting movement count`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const count = await VerplaatsingService.getVerplaatsingCount();
    if (count) {
      logger.name = "Verplaatsing";
      logger.info(`${emoji.get('round_pushpin')}  Getting count of all movements`);
      logger.name = "Server";
      return res.status(200).json(`Count of all movements: ${count}`);
    }
    logger.name = "Verplaatsing";
    logger.warn(`${emoji.get('round_pushpin')}  No movements found`);
    logger.name = "Server";
    return res.status(404).json('Geen verplaatsingen gevonden');
  } catch (error: any) {
    logger.name = "Verplaatsing";
    logger.error(`${emoji.get('round_pushpin')}  An error occurred while getting movement count`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

/**
 * @openapi
 * /api/verplaatsingen/{id}:
 *   get:
 *     summary: Get a single verplaatsing by its id
 *     tags:
 *      - Verplaatsingen
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested verplaatsing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Verplaatsing"
 *       401:
 *         description: You are not authorized to view this part of the application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         description: You can only request your own information unless you're an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: No verplaatsing with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// GET: Verplaatsing by id
verplaatsingRouter.get('/:id', 
checkJwt,
checkScopes,
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
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

checkScopes = requiredScopes('write');

/**
 * @openapi
 * /api/verplaatsingen:
 *   post:
 *     summary: Post/create a new verplaatsing
 *     tags:
 *      - Verplaatsingen
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       201:
 *         description: Verplaatsing created succesfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Verplaatsing"
 *       401:
 *         description: You are not authorized to view/edit this part of the application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         description: You can not post new Verplaatsingen unless you have the right permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 */

//POST: create a new Verplaatsing
// params: reiziger_id, bestemming_id, vervoersmiddel_id
verplaatsingRouter.post("/",
checkJwt,
checkScopes,
body("reiziger_id").isInt({ min: 1 }).withMessage("reiziger_id must be a positive integer"),
body("bestemming_id").isInt({ min: 1 }).withMessage("bestemming_id must be a positive integer"),
body("vervoersmiddel_id").isInt({ min: 1 }).withMessage("vervoersmiddel_id must be a positive integer"),
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

/**
 * @openapi
 * /api/verplaatsingen/{id}:
 *   put:
 *     summary: Update a single verplaatsing
 *     tags:
 *      - Bestemmingen
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The updated verplaatsing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Verplaatsing"
 *       401:
 *         description: You are not authorized to view this part of the application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         description: You can only request your own information unless you're an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: No verplaatsing with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// PUT: update a Verplaatsing
// params: reiziger_id, bestemming_id, vervoersmiddel_id
verplaatsingRouter.put("/:id",
checkJwt,
checkScopes,
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
body("reiziger_id").isInt({ min: 1 }).withMessage("reiziger_id must be a positive integer"),
body("bestemming_id").isInt({ min: 1 }).withMessage("bestemming_id must be a positive integer"),
body("vervoersmiddel_id").isInt({ min: 1 }).withMessage("vervoersmiddel_id must be a positive integer"),
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

/**
 * @openapi
 * /api/verplaatsingen/{id}:
 *   delete:
 *     summary: Delete a single verplaatsing
 *     tags:
 *      - Verplaatsingen
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The deleted verplaatsing (empty body)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Verplaatsing"
 *       401:
 *         description: You are not authorized to view this part of the application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         description: You can only request your own information unless you're an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: No verplaatsing with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// DELETE: delete a Verplaatsing
verplaatsingRouter.delete("/:id", 
checkJwt,
checkScopes,
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
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
