import { OkPacket } from "mysql";
// Models
import { UnauthorizedError, ValidationError } from "../2-models/client-errors";
import CredentialsModel from "../2-models/credentials-model";
import RoleModel from "../2-models/role-model";
import UserModel from "../2-models/user-model";
// Utils
import cyber from "../4-utils/cyber";
import dal from "../4-utils/dal";

// ====================== Register new user: ======================
async function register(user: UserModel): Promise<string> {
  // Joi Validation...
  user.validatePost();

  // Is username taken:
  const isTaken = await isEmailTaken(user.email);
  if (isTaken) throw new ValidationError(`Email ${user.email} already taken`);

  // Hash password
  user.password = cyber.hashPassword(user.password);

  // Set role as a regular user:
  user.roleId = RoleModel.User;

  // Create query:
  const sql = `INSERT INTO users VALUES(DEFAULT,?,?,?,?,?)`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.roleId,
  ]);

  // Set back auto-increment id:
  user.userId = result.insertId;

  // Create token:
  const token = cyber.createToken(user);

  // Return token:
  return token;
}

// ====================== Check if user name is already taken ======================
async function isEmailTaken(email: string): Promise<boolean> {
  // Create query:
  const sql = `SELECT EXISTS(SELECT * FROM users WHERE email = ?) AS isTaken`;

  // Execute:
  const arr = await dal.execute(sql, [email]);

  // Get is taken value:
  const isTaken: number = arr[0].isTaken;

  // Return true if username taken:
  return isTaken === 1;
}

// ====================== Login: ======================
async function login(credentials: CredentialsModel): Promise<string> {
  // Joi Validation...
  credentials.validatePost();

  // Hash password
  const hashedPassword = cyber.hashPassword(credentials.password);
  // credentials.password = cyber.hashPassword(credentials.password);

  // Query:
  const sql = `SELECT * FROM users WHERE email = ? AND (password = ? OR ?)`;

  // Execute:
  const users = await dal.execute(sql, [
    credentials.email,
    credentials.password,
    hashedPassword,
  ]);

  // Extract user:
  const user = users[0];

  // If user not exist:
  if (!user) throw new UnauthorizedError("Incorrect email or password");

  // Create token:
  const token = cyber.createToken(user);

  // Return token:
  return token;
}

export default {
  register,
  login,
};
