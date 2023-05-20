import express, { Request, Response, NextFunction } from "express";
// Model
import LuggageModel from "../2-models/luggage-model";
// Service
import luggageService from "../5-services/luggage-service";

const router = express.Router();

// GET http://localhost:4000/api/luggage
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const luggage = await luggageService.getAllLuggage();
      response.json(luggage);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:4000/api/luggage/
router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const luggage = new LuggageModel(
        request.body.luggageId,
        request.body.luggageName
      );
      const addedLuggage = await luggageService.insertLuggage(luggage);
      response.status(201).json(addedLuggage);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
