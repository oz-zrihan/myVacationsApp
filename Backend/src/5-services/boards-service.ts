import { OkPacket } from "mysql";
// Model
import BoardModel from "../2-models/board-model";
// Utils
import dal from "../4-utils/dal";

// Get all boards
async function getAllBoards(): Promise<BoardModel[]> {
  // Query
  const sql = `SELECT * FROM boards`;

  // Execute:
  const boards = await dal.execute(sql);

  return boards;
}

// ====================== insert board ======================
async function insertBoard(board: BoardModel): Promise<BoardModel> {
  // delete boardId
  delete board.boardId;

  // Joi validation
  board.validatePost();

  // Query
  const sql = `INSERT INTO boards VALUES(DEFAULT, ?)`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [board.boardName]);

  // Insert to airline given Id
  board.boardId = result.insertId;

  return board;
}

export default {
  getAllBoards,
  insertBoard,
};
