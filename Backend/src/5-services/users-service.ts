import { OkPacket } from "mysql";
// Models
import {ResourceNotFoundError, ValidationError} from "../2-models/client-errors";
import UserModel from "../2-models/user-model";
import RoleModel from "../2-models/role-model";
// Utils
import dal from "../4-utils/dal";
import cyber from "../4-utils/cyber";

// ====================== Get all users ======================
async function getAllUsers(): Promise<UserModel[]> {
  // Query
  const sql = `SELECT * FROM users`;

  // Execute:
  const users = await dal.execute(sql);

  return users;
}
// ====================== Get single users ======================
async function getSingleUser(userId: number): Promise<UserModel> {
  // Query
  const sql = `SELECT * FROM users WHERE userId = ?`;

  // Execute:
  const users = await dal.execute(sql, [userId]);
  const user = users[0];

  // Error if not exist
  if (!user) {
    throw new ResourceNotFoundError(userId);
  }

  return user;
}

// ====================== update full user ======================
async function updateUser(user: UserModel): Promise<UserModel> {
  // Joi validation
  user.validatePut();

  // Is username taken:
  const isTaken = await isEmailTaken(user.email, user.userId);
  if (isTaken) throw new ValidationError(`Email ${user.email} already taken`);

  // Hash password
  user.password = cyber.hashPassword(user.password);

  // Set role as a regular user:
  user.roleId = RoleModel.User;

  // Query
  const sql = `UPDATE users SET firstName = ?, lastName = ?, email =?, password = ?, roleId = ? WHERE userId = ?`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.roleId,
    user.userId,
  ]);

  // Validate execution
  if (result.affectedRows === 0) {
    throw new ResourceNotFoundError(user.userId);
  }

  return user;
}

// ====================== Delete user ======================
async function deleteUser(userId: number): Promise<void> {
  // Query
  const sql = `DELETE FROM users WHERE userId = ?`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [userId]);

  // Validate execution
  if (result.affectedRows === 0) {
    throw new ResourceNotFoundError(userId);
  }
}

// ====================== Check if user name is already taken ======================
async function isEmailTaken(email: string, userId: number): Promise<boolean> {
  // Create query:
  const sql = `SELECT * FROM users WHERE email = ?`;

  // Execute:
  const result = await dal.execute(sql, [email]);

  // Create user From result:
  const user = new UserModel(result[0]);

  //  Check if no result:
  if (!result) {
    return false;
  }
  //   if there is a result -> check if the mail belong to the user:
  else if (user.userId === userId) {
    return false;
  } else {
    return true;
  }
}

export default {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
