import express, { Request, Response, NextFunction } from "express";
// Model
import UserModel from "../2-models/user-model";
// Service
import usersService from "../5-services/users-service";
// Middleware
import blockNonLoggedIn from "../3-middleware/block-non-logged-in";
import verifyId from "../3-middleware/verifyId";

const router = express.Router();

// GET http://localhost:4000/api/users
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const users = await usersService.getAllUsers();
      response.json(users);
    } catch (err: any) {
      next(err);
    }
  }
);

// GET http://localhost:4000/api/users/:userId
router.get(
  "/:userId([0-9]+)",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = +request.params.userId;
      const user = await usersService.getSingleUser(userId);
      response.json(user);
    } catch (err: any) {
      next(err);
    }
  }
);

// PUT http://localhost:4000/api/users/:userId
router.put(
  "/:userId([0-9]+)",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const user = new UserModel(request.body);
      const updatedUser = await usersService.updateUser(user);
      response.json(updatedUser);
    } catch (err: any) {
      next(err);
    }
  }
);

// DELETE http://localhost:4000/api/users/:userId
router.delete(
  "/:userId([0-9]+)",
  [blockNonLoggedIn, verifyId],
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const userId = +request.params.userId;
      await usersService.deleteUser(userId);
      response.sendStatus(204);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
