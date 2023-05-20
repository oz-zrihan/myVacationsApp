import express, { Request, Response, NextFunction } from "express";
// Model
import AirlineModel from "../2-models/airline-model";
// Service
import airlinesService from "../5-services/airlines-service";

const router = express.Router();

// GET http://localhost:4000/api/airlines
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const airlines = await airlinesService.getAllAirlines();
      response.json(airlines);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:4000/api/countries/
router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const airline = new AirlineModel(
        request.body.airlineId,
        request.body.airlineName
      );
      const addedAirline = await airlinesService.insertAirline(airline);
      response.status(201).json(addedAirline);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
