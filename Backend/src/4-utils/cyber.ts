import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Request } from "express";
import crypto from "crypto";
// Models
import UserModel from "../2-models/user-model";
import { UnauthorizedError } from "../2-models/client-errors";
import RoleModel from "../2-models/role-model";

// Secret Key
const secretKey = "JohnBryceFinalProject";

// ================== Create new token: ==================
function createToken(user: UserModel): string {
  // Delete user password:
  delete user.password;

  // Create container containing the user:
  const container = { user };

  // Create options:
  const options = { expiresIn: "3h" };

  // Create token:
  const token = jwt.sign(container, secretKey, options);

  // Return:
  return token;
}

// ================== Verify Token ==================
async function verifyToken(request: Request): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    // Extract header:
    const header = request.header("authorization"); // "Bearer the-token"

    // If no header:
    if (!header) {
      reject(new UnauthorizedError("Incorrect username or password"));
      return;
    }

    // Extract token:
    const token = header.substring(7);

    // If no token:
    if (!token) {
      reject(new UnauthorizedError("Incorrect username or password"));
      return;
    }

    // Verify:
    jwt.verify(token, secretKey, (err: JsonWebTokenError) => {
      if (err) {
        console.log(err);
        reject(new UnauthorizedError("Invalid token"));
        return;
      }

      // All is good:
      resolve(true);
    });
  });
}

// ================== Verify Admin ==================
async function verifyAdmin(request: Request): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      // Extract header:
      const header = request.header("authorization"); // "Bearer the-token"

      // If no header:
      if (!header) {
        reject(new UnauthorizedError("Incorrect username or password"));
        return;
      }

      // Extract token:
      const token = header.substring(7);

      // If no token:
      if (!token) {
        reject(new UnauthorizedError("Incorrect username or password"));
        return;
      }

      // Verify:
      jwt.verify(token, secretKey, (err, container: { user: UserModel }) => {
        if (err) {
          reject(new UnauthorizedError("Invalid token"));
          return;
        }

        // Extract user from token:
        const user: UserModel = container.user;

        // If user is not admin:
        if (user.roleId !== RoleModel.Admin) {
          reject(new UnauthorizedError("Access denied"));
          return;
        }

        // All is good:
        resolve(true);
      });
    } catch (err: any) {
      reject(err);
    }
  });
}

// ================== Verify user Id same as token ==================
function verifyId(request: Request, userId: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    try {
      // Extract header:
      const header = request.header("authorization");

      // If no header:
      if (!header) {
        reject(new UnauthorizedError("Incorrect username or password"));
        return;
      }

      // Extract token:
      const token = header.substring(7);

      // If no token:
      if (!token) {
        reject(new UnauthorizedError("Incorrect username or password"));
        return;
      }

      // Verify:
      jwt.verify(token, secretKey, (err: JsonWebTokenError, container: any) => {
        if (err) {
          reject(new UnauthorizedError("Invalid token"));
          return;
        }

        // Extract user from token:
        const user: UserModel = container.user;
        //verify that given id is the same as token id
        if (user.userId !== userId) {
          reject(new UnauthorizedError("Access denied"));
          return;
        }

        resolve(true);
      });
    } catch (err: any) {
      reject(err);
    }
  });
}

// ================== Hashing password ==================
function hashPassword(plainText: string): string {
  // Salt string
  const salt = "VaCaTiOn$BrYcE@FinalProject!!";

  // Hash with salt
  const hashedText = crypto
    .createHmac("sha512", salt)
    .update(plainText)
    .digest("hex");

  return hashedText;
}

export default {
  createToken,
  verifyToken,
  verifyAdmin,
  verifyId,
  hashPassword,
};
