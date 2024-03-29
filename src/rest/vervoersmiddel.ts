import express from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as VervoersmiddelService from '../service/vervoersmiddel.service';
import { checkJwt } from '../core/auth';
import { requiredScopes } from 'express-oauth2-jwt-bearer';

export const vervoersmiddelRouter = express.Router();


/**
 * @openapi
 * tags:
 *   name: Vervoersmiddelen
 *   description: Represents a Vervoersmiddel in the system
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Vervoersmiddel:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - type
 *           properties:
 *             type:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Vervoersmiddel"
 *     VervoersmiddelenList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Vervoersmiddel"
 *   examples:
 *     Vervoersmiddel:
 *       id: 123
 *       type: "boot"
 */


let checkScopes = requiredScopes('read');

/**
 * @openapi
 * /api/vervoersmiddelen:
 *   get:
 *     summary: Get all vervoersmiddelen
 *     tags:
 *      - Vervoersmiddelen
 *     responses:
 *       200:
 *         description: List of vervoersmiddelen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VervoersmiddelenList"
 */

// GET: list of all Vervoersmiddelen
vervoersmiddelRouter.get('/', 
checkJwt,
checkScopes,
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while getting all means of transport`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const vervoersmiddelen = await VervoersmiddelService.listVervoersmiddelen();
    const count = await VervoersmiddelService.getVervoersmiddelCount();
    if (vervoersmiddelen && count) {
      logger.name = "Vervoersmiddel";
      logger.info(`${emoji.get('taxi')}  Getting all means of transport`);
      logger.name = "Server";
      const vervoersmiddelenWithCount = { count, vervoersmiddelen };
      return res.status(200).json(vervoersmiddelenWithCount);
    }
    logger.name = "Vervoersmiddel";
    logger.warn(`${emoji.get('taxi')}  No means of transport found`);
    logger.name = "Server";
    return res.status(404).json('Geen vervoersmiddelen gevonden');   
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while getting all means of transport`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

/**
 * @openapi
 * /api/vervoersmiddelen:
 *   get:
 *     summary: Get count of all vervoersmiddelen
 *     tags:
 *      - Vervoersmiddelen
 *     responses:
 *       200:
 *         description: Count of vervoermsiddelen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VervoersmiddelenList"
 */

//GET: Vervoersmiddel count
vervoersmiddelRouter.get('/count',
checkJwt,
checkScopes,
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while getting the number of means of transport`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const count = await VervoersmiddelService.getVervoersmiddelCount();
    if (count) {
      logger.name = "Vervoersmiddel";
      logger.info(`${emoji.get('taxi')}  Getting count of means of transport`);
      logger.name = "Server";
      return res.status(200).json(`Count of all means of transport: ${count}`);
    }
    logger.name = "Vervoersmiddel";
    logger.warn(`${emoji.get('taxi')}  No means of transport found`);
    logger.name = "Server";
    return res.status(404).json('Geen vervoersmiddelen gevonden');
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while getting the number of means of transport`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

/**
 * @openapi
 * /api/vervoersmiddelen/{id}:
 *   get:
 *     summary: Get a single vervoersmiddel by its id
 *     tags:
 *      - Vervoersmiddelen
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested vervoersmiddel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Vervoersmiddel"
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
 *         description: No vervoersmiddel with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// GET: Vervoersmiddel by id
vervoersmiddelRouter.get('/:id', 
checkJwt,
checkScopes,
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id: number = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while getting mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const vervoersmiddel = await VervoersmiddelService.getVervoersmiddelById(id);
    if (vervoersmiddel) {
      logger.name = "Vervoersmiddel";
      logger.info(`${emoji.get('taxi')}  Getting mean of transport with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(vervoersmiddel);
    }
    logger.name = "Vervoersmiddel";
    logger.warn(`${emoji.get('taxi')}  Mean of transport with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Vervoersmiddel niet gevonden');
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while getting mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

checkScopes = requiredScopes('write');

/**
 * @openapi
 * /api/vervoersmiddelen:
 *   post:
 *     summary: Post/create a new vervoersmiddel
 *     tags:
 *      - Vervoersmiddelen
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       201:
 *         description: Vervoermsiddel created succesfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Vervoersmiddel"
 *       401:
 *         description: You are not authorized to view/edit this part of the application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         description: You can not post new Vervoersmiddelen unless you have the right permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 */

//POST: create a new Vervoersmiddel
// params: type
vervoersmiddelRouter.post("/",
checkJwt,
checkScopes,
body("type").isString().isLength({ min: 1, max: 255 }).withMessage("Type must be a string between 1 and 255 characters"),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while creating a new mean of transport`);
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
    logger.error(`${emoji.get('taxi')}  An error occurred while creating a new mean of transport`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

/**
 * @openapi
 * /api/vervoersmiddelen/{id}:
 *   put:
 *     summary: Update a single vervoersmiddel
 *     tags:
 *      - Vervoersmiddelen
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The updated vervoersmiddel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Vervoersmiddel"
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
 *         description: No vervoersmiddel with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// PUT: update a Vervoersmiddel
// params: type
vervoersmiddelRouter.put("/:id",
checkJwt,
checkScopes,
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
body("type").isString().isLength({ min: 1, max: 255 }).withMessage("Type must be a string between 1 and 255 characters"),
async (req: Request, res: Response) => {
  const errors = validationResult(req); 
  const id = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while updating mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const vervoersmiddel = req.body;
    const updatedVervoersmiddel = await VervoersmiddelService.updateVervoersmiddel(id, vervoersmiddel);
    if(updatedVervoersmiddel) {
      logger.name = "Vervoersmiddel";
      logger.info(`${emoji.get('taxi')}  Updating mean of transport with id ${id}`);
      logger.name = "Server";
      return res.status(200).json(updatedVervoersmiddel);
    }
    logger.name = "Vervoersmiddel";
    logger.warn(`${emoji.get('taxi')}  Mean of transport with id ${id} not found`);
    logger.name = "Server";
    return res.status(404).json('Vervoersmiddel niet gevonden');
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while updating mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

/**
 * @openapi
 * /api/vervoersmiddelen/{id}:
 *   delete:
 *     summary: Delete a single vervoermsiddel
 *     tags:
 *      - Vervoersmiddelen
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The deleted vervoersmiddel (empty body)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Vervoersmiddel"
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
 *         description: No vervoermsiddel with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// DELETE: delete a Vervoersmiddel
vervoersmiddelRouter.delete("/:id", 
checkJwt,
checkScopes,
param("id").isInt({ min: 1 }).withMessage("Id must be a positive integer"),
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const id = parseInt(req.params.id, 10);
  if (!errors.isEmpty()) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while deleting mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await VervoersmiddelService.deleteVervoersmiddel(id);
    logger.name = "Vervoersmiddel";
    logger.info(`${emoji.get('taxi')}  Deleting mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(204).send();
  } catch (error: any) {
    logger.name = "Vervoersmiddel";
    logger.error(`${emoji.get('taxi')}  An error occurred while deleting mean of transport with id ${id}`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});
