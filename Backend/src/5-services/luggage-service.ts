import { OkPacket } from "mysql";
// Model
import LuggageModel from "../2-models/luggage-model";
// Utils
import dal from "../4-utils/dal";

// ====================== Get All luggage ======================
async function getAllLuggage(): Promise<LuggageModel[]> {
  // Query
  const sql = `SELECT * FROM luggage`;

  // Execute:
  const boards = await dal.execute(sql);

  return boards;
}

// ====================== insert luggage ======================
async function insertLuggage(luggage: LuggageModel): Promise<LuggageModel> {
  // Delete luggageId
  delete luggage.luggageId;

  // Joi validation
  luggage.validatePost();

  // Query
  const sql = `INSERT INTO luggage VALUES(DEFAULT, ?)`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [luggage.luggageName]);

  // Insert to airline given Id
  luggage.luggageId = result.insertId;

  return luggage;
}

export default {
  getAllLuggage,
  insertLuggage,
};
