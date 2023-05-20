import express, { Request, Response, NextFunction } from "express";
// Model
import BoardModel from "../2-models/board-model";
// Service
import boardsService from "../5-services/boards-service";

const router = express.Router();

// GET http://localhost:4000/api/boards
router.get(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const boards = await boardsService.getAllBoards();
      response.json(boards);
    } catch (err: any) {
      next(err);
    }
  }
);

// POST http://localhost:4000/api/boards/
router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const board = new BoardModel(
        request.body.boardId,
        request.body.boardName
      );
      const addedBoard = await boardsService.insertBoard(board);
      response.status(201).json(addedBoard);
    } catch (err: any) {
      next(err);
    }
  }
);

export default router;
