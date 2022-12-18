// import express, { NextFunction } from "express";
// import healthService from "../service/health.service";

// const healthRouter = express.Router();

// healthRouter.get('/health',
// async (ctx: any, req: Request, res: Response, next: NextFunction) => {
//   try {
//     const health = await healthService.health(ctx);
//     if (health) {
//       return res.status(200).json(health);
//     }
//     return res.status(404).json('Geen health gevonden');
//   } catch (error: any) {
//     return res.status(500).json(error.message);
//   }
// });