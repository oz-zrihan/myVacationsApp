import { OkPacket } from "mysql";
// Models
import { ResourceNotFoundError } from "../2-models/client-errors";
import VacationModel from "../2-models/vacation-model";
// Utils
import dal from "../4-utils/dal";

//  ====================== Get all vacations ======================
async function getAllVacations(): Promise<VacationModel[]> {

  //Query
  const sql = `SELECT V.*, C.countryName, B.boardName, A.airlineName, L.luggageName
                    FROM vacations AS V 
                    JOIN countries AS C ON C.countryId = V.countryId 
                    JOIN boards AS B ON B.boardId = V.boardId 
                    JOIN airlines AS A ON A.airlineId = V.airlineId 
                    JOIN luggage AS L ON L.luggageId = V.luggageId`;

  // Execute:
  const vacations = await dal.execute(sql);

  return vacations;
}

// ====================== Get single vacations ======================
async function getSingleVacation(vacationId: number): Promise<VacationModel> {
  //Query
  const sql = `SELECT V.*, C.countryName, B.boardName, A.airlineName, L.luggageName
                    FROM vacations AS V 
                    JOIN countries AS C ON C.countryId = V.countryId 
                    JOIN boards AS B ON B.boardId = V.boardId 
                    JOIN airlines AS A ON A.airlineId = V.airlineId 
                    JOIN luggage AS L ON L.luggageId = V.luggageId
                    WHERE vacationId = ?`;

  // Execute:
  const vacations = await dal.execute(sql, [vacationId]);
  const vacation = vacations[0];

  // Error if not exist
  if (!vacation) {
    throw new ResourceNotFoundError(vacationId);
  }

  return vacation;
}

// ====================== Insert vacation ======================
async function insertVacation(vacation: VacationModel): Promise<VacationModel> {
  delete vacation.vacationId;

  // Joi validation
  vacation.validatePost();

  // Query
  const sql = `INSERT INTO vacations VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [
    vacation.countryId,
    vacation.city,
    vacation.hotel,
    vacation.starsId,
    vacation.boardId,
    vacation.airlineId,
    vacation.luggageId,
    vacation.departureTime,
    vacation.returnTime,
    vacation.price,
    vacation.description,
    vacation.imagesFolder,
  ]);

  // Insert to user given Id
  vacation.vacationId = result.insertId;
  const addedVacation = await getSingleVacation(vacation.vacationId);
  return addedVacation;
}

// ====================== Update full Vacation ======================
async function updateVacation(vacation: VacationModel): Promise<VacationModel> {
  // Joi validation
  vacation.validatePut();

  // Query
  const sql = `UPDATE vacations SET 
                                  countryId = ?,
                                  city = ?, hotel = ?,
                                  starsId = ?,
                                  boardId = ?,
                                  airlineId = ?,
                                  luggageId = ?,
                                  departureTime = ?,
                                  returnTime = ?,
                                  price = ?,
                                  description = ?,
                                  imagesFolder = ?
                                  WHERE vacationId = ?`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [
    vacation.countryId,
    vacation.city,
    vacation.hotel,
    vacation.starsId,
    vacation.boardId,
    vacation.airlineId,
    vacation.luggageId,
    vacation.departureTime,
    vacation.returnTime,
    vacation.price,
    vacation.description,
    vacation.imagesFolder,
    vacation.vacationId,
  ]);

  // Validate execution
  if (result.affectedRows === 0) {
    throw new ResourceNotFoundError(vacation.vacationId);
  }

  return vacation;
}

// ====================== Update partial vacation ======================
async function updatePartialVacation(
  vacation: VacationModel
): Promise<VacationModel> {
  // Joi validation
  vacation.validatePatch();

  // Get DB user
  const dbVacation = await getSingleVacation(vacation.vacationId);

  // Loop over "old user" and update changes
  for (const key in vacation) {
    if (vacation[key] !== undefined) {
      dbVacation[key] = vacation[key];
    }
  }

  // Send updated user object to server
  await updateVacation(dbVacation);

  return dbVacation;
}

// ====================== Delete vacation ======================
async function deleteVacation(vacationId: number): Promise<void> {
  // Query
  const sql = `DELETE FROM vacations WHERE vacationId = ?`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [vacationId]);

  // Validate execution
  if (result.affectedRows === 0) {
    throw new ResourceNotFoundError(vacationId);
  }
}

export default {
  getAllVacations,
  getSingleVacation,
  insertVacation,
  updateVacation,
  updatePartialVacation,
  deleteVacation,
};
