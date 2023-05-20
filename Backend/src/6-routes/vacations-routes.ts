import express, { Request, Response, NextFunction } from "express";
// Model
import VacationModel from "../2-models/vacation-model";
// Service
import vacationsService from "../5-services/vacations-service";

const router = express.Router();

// GET http://localhost:4000/api/vacations
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const vacations = await vacationsService.getAllVacations();
      response.json(vacations);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:4000/api/vacations/:vacationId
router.get(
  "/:vacationId([0-9]+)",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const vacationId = +request.params.vacationId;
      const vacation = await vacationsService.getSingleVacation(vacationId);
      response.json(vacation);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:4000/api/vacations/
router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const vacation = new VacationModel(request.body);
      const addedVacation = await vacationsService.insertVacation(vacation);
      response.status(201).json(addedVacation);
    } catch (err: any) {
      next(err);
    }
  }
);

// PUT http://localhost:4000/api/vacations/:vacationId
router.put(
  "/:vacationId([0-9]+)",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body.vacationId = +request.params.vacationId;
      const vacation = new VacationModel(request.body);
      const updatedVacation = await vacationsService.updateVacation(vacation);
      response.json(updatedVacation);
    } catch (err: any) {
      next(err);
    }
  }
);

// PATCH http://localhost:4000/api/vacations/:vacationId
router.patch(
  "/:vacationId([0-9]+)",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body.vacationId = +request.params.vacationId;
      const vacation = new VacationModel(request.body);
      const updatedVacation = await vacationsService.updatePartialVacation(
        vacation
      );
      response.json(updatedVacation);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE http://localhost:4000/api/vacations/:vacationId
router.delete(
  "/:vacationId([0-9]+)",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const vacationId = +request.params.vacationId;
      await vacationsService.deleteVacation(vacationId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
