import express, { Request, Response, NextFunction } from "express";
// Model
import FollowerModel from "../2-models/follower-model";
// Service
import followersService from "../5-services/followers-service";

const router = express.Router();

// GET http://localhost:4000/api/followers
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const followers = await followersService.getAllFollowers();
      response.json(followers);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:4000/api/followers/by-user/:userId
router.get(
  "/by-user/:UserId([0-9]+)",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = +request.params.userId;
      const follower = await followersService.getSingleFollower(userId);
      response.json(follower);
    } catch (err: any) {
      next(err);
    }
  }
);
// GET http://localhost:4000/api/followers/by-vacation/:vacationId
router.get(
  "/by-vacation/:vacationId([0-9]+)",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const vacationId = +request.params.vacationId;
      const followers = await followersService.getFollowersByVacation(
        vacationId
      );
      response.json(followers);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:4000/api/followers/
router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const follower = new FollowerModel(request.body);
      const addedFollower = await followersService.insertFollower(follower);
      response.status(201).json(addedFollower);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE http://localhost:4000/api/followers/delete?vacationId=__&userId=__
router.delete(
  "/delete",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const vacationId = +request.query.vacationId;
      const userId = +request.query.userId;

      await followersService.deleteFollower(vacationId, userId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
