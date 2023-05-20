import { OkPacket } from "mysql";
// Model
import { ResourceNotFoundError } from "../2-models/client-errors";
import FollowerModel from "../2-models/follower-model";
// Utils
import dal from "../4-utils/dal";

// ====================== Get all followers ======================
async function getAllFollowers(): Promise<FollowerModel[]> {
  // Query
  const sql = `SELECT * FROM followers`;

  // Execute
  const followers = await dal.execute(sql);

  return followers;
}
// ====================== Get one follower ======================
async function getSingleFollower(userId: number): Promise<FollowerModel[]> {
  // Query
  const sql = `SELECT * FROM followers WHERE userId = ?`;

  // Execute:
  const followers = await dal.execute(sql, [userId]);

  // Error if not exist
  if (!followers) {
    throw new ResourceNotFoundError(userId);
  }

  return followers;
}
// ====================== Get followers by vacation ======================
async function getFollowersByVacation(
  vacationId: number
): Promise<FollowerModel> {
  // Query
  const sql = `SELECT * FROM followers WHERE vacationId = ?`;

  // Execute
  const follower = await dal.execute(sql, [vacationId]);

  return follower;
}

// ====================== Insert followers ======================
async function insertFollower(follower: FollowerModel): Promise<FollowerModel> {
  // Joi validation
  follower.validatePost();
  // Query
  const sql = `INSERT INTO followers VALUES(?, ?)`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [
    follower.vacationId,
    follower.userId,
  ]);

  return follower;
}

// ====================== Delete followers ======================
async function deleteFollower(
  vacationId: number,
  userId: number
): Promise<void> {
  // Query
  const sql = `DELETE FROM followers WHERE vacationID = ? AND userId = ?`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [vacationId, userId]);

  // Validate execution
  if (result.affectedRows === 0) {
    throw new ResourceNotFoundError(userId + "or" + vacationId);
  }
}

export default {
  getAllFollowers,
  getSingleFollower,
  getFollowersByVacation,
  insertFollower,
  deleteFollower,
};
