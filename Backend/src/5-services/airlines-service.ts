import { OkPacket } from "mysql";
// Model
import AirlineModel from "../2-models/airline-model";
// Utils
import dal from "../4-utils/dal";

// ====================== Get all airlines ======================
async function getAllAirlines(): Promise<AirlineModel[]> {
  // Query
  const sql = `SELECT * FROM airlines`;

  // Execute:
  const airlines = await dal.execute(sql);

  return airlines;
}

// ====================== insert airline ======================
async function insertAirline(airline: AirlineModel): Promise<AirlineModel> {
  // Delete airlinID
  delete airline.airlineId;

  // Joi validation
  airline.validatePost();

  // Query
  const sql = `INSERT INTO airlines VALUES(DEFAULT, ?)`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [airline.airlineName]);

  // Insert to airline given Id
  airline.airlineId = result.insertId;

  return airline;
}

export default {
  getAllAirlines,
  insertAirline,
};
