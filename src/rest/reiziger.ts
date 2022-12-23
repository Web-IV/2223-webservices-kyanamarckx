import express from 'express';
import emoji from 'node-emoji';
import type { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { $log as logger} from "ts-log-debug";
logger.level = "debug";

import * as ReizigerService from '../service/reiziger.service';
import { checkJwt } from '../core/auth';
import { requiredScopes } from 'express-oauth2-jwt-bearer';
export const reizigerRouter = express.Router();


/**
 * @openapi
 * tags:
 *   name: Reizigers
 *   description: Represents a Reiziger in the system
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Reiziger:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - voornaam
 *             - naam
 *             - geboortedatum
 *             - stad
 *             - straat
 *             - huisnummer
 *             - auth0id
 *           properties:
 *             voornaam:
 *               type: "string"
 *             naam:
 *               type: "string"
 *             geboortedatum:
 *               type: "string"
 *             stad:
 *               type: "string"
 *             straat:
 *               type: "string"
 *             huisnummer:
 *               type: "string"
 *             auth0id:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Reiziger"
 *     ReizigersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Reiziger"
 *   examples:
 *     Reiziger:
 *       id: 123
 *       voornaam: "Kyana"
 *       naam: "Marckx"
 *       geboortedatum: "2003-10-01"
 *       stad: "Lierde"
 *       straat: "Keistraat"
 *       huisnummer: "1C"
 *       auth0id: auth0|639a0a121568a9f37000fec0
 */

let checkScopes = requiredScopes('read');


/**
 * @openapi
 * /api/reizigers:
 *   get:
 *     summary: Get all reizigers
 *     tags:
 *      - Reizigers
 *     responses:
 *       200:
 *         description: List of reizigers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReizigersList"
 */

// GET: list of all Reizigers
reizigerRouter.get('/', 
checkJwt,
checkScopes,
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting all travellers`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const reizigers = await ReizigerService.getReizigers();
    const count = await ReizigerService.getReizigerCount();
    if (reizigers && count) {
      logger.name = "Reiziger";
      logger.info(`${emoji.get('alien')}  Getting all travellers`);
      logger.name = "Server";
      const reizigersWithCount = { count, reizigers };
      return res.status(200).json(reizigersWithCount);
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

/**
 * @openapi
 * /api/reizigers:
 *   get:
 *     summary: Get count of all reizigers
 *     tags:
 *      - Reizigers
 *     responses:
 *       200:
 *         description: Count of reizigers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ReizigersList"
 */

// GET: count of all reizigers
reizigerRouter.get('/count',
checkJwt,
checkScopes,
async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting count of all travellers`);
    logger.name = "Server";
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const count = await ReizigerService.getReizigerCount();
    if (count) {
      logger.name = "Reiziger";
      logger.info(`${emoji.get('alien')}  Getting count of all travellers`);
      logger.name = "Server";
      return res.status(200).json(`Count of all travellers: ${count}`);
    }
    logger.name = "Reiziger";
    logger.warn(`${emoji.get('alien')}  No travellers found`);
    logger.name = "Server";
    return res.status(404).json('Geen reizigers gevonden');
  } catch (error: any) {
    logger.name = "Reiziger";
    logger.error(`${emoji.get('alien')}  An error occurred while getting count of all travellers`);
    logger.name = "Server";
    return res.status(500).json(error.message);
  }
});

/**
 * @openapi
 * /api/reizigers/{id}:
 *   get:
 *     summary: Get a single reiziger by their id
 *     tags:
 *      - Reizigers
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reiziger"
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
 *         description: No reiziger with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// GET: Reiziger by id
reizigerRouter.get('/:id', 
checkJwt,
checkScopes,
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

/**
 * @openapi
 * /api/reizigers/auth0/{id}:
 *   get:
 *     summary: Get a single reiziger by their auth0id
 *     tags:
 *      - Reizigers
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested reiziger
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reiziger"
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
 *         description: No user with the given auth0id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

//GET: reiziger by auth0id
reizigerRouter.get('/auth0/:id',
checkJwt,
checkScopes,
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

checkScopes = requiredScopes('write');

/**
 * @openapi
 * /api/reizigers:
 *   post:
 *     summary: Post/create a new reiziger
 *     tags:
 *      - Reizigers
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       201:
 *         description: Reiziger created succesfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reiziger"
 *       401:
 *         description: You are not authorized to view/edit this part of the application
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/401Unauthorized'
 *       403:
 *         description: You can not post new Reizigers unless you have the right permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 */

//POST: create a new Reiziger
//params: voornaam, naam, geboortedatum, stad, straat, huisnummer, auth0id
reizigerRouter.post("/", 
checkJwt,
checkScopes,
body("voornaam").isString().isLength({ min: 1, max: 255 }).withMessage("Voornaam must be between 1 and 255 characters"),
body("naam").isString().isLength({ min: 1, max: 255 }).withMessage("Naam must be between 1 and 255 characters"),
body("geboortedatum").isString().isLength({ min: 10, max: 10 }).withMessage("Geboortedatum must be exact 10 characters (type: YYYY-MM-DD)"),
body("stad").isString().isLength({ min: 1, max: 255 }).withMessage("Stad must be between 1 and 255 characters"),
body("straat").isString().isLength({ min: 1, max: 255 }).withMessage("Straat must be between 1 and 255 characters"),
body("huisnummer").isString().isLength({ min: 1, max: 10 }).withMessage("Huisnummer must be between 1 and 10 characters"),
body("auth0id").isString().isLength({ min: 5, max: 255 }).withMessage("Auth0id must be between 5 and 255 characters"),
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

/**
 * @openapi
 * /api/reizigers/{id}:
 *   put:
 *     summary: Update a single reiziger
 *     tags:
 *      - Reizigers
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The updated reiziger
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reiziger"
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
 *         description: No reiziger with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// PUT: update a Reiziger
// params: voornaam, naam, geboortedatum, stad, straat, huisnummer, auth0id
reizigerRouter.put("/:id",
checkJwt,
checkScopes,
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

/**
 * @openapi
 * /api/reizigers/{id}:
 *   delete:
 *     summary: Delete a single reiziger
 *     tags:
 *      - Reizigers
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The deleted reiziger (empty body)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Reiziger"
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
 *         description: No reiziger with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */

// DELETE: delete a Reiziger
reizigerRouter.delete("/:id", 
checkJwt,
checkScopes,
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
