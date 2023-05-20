import Joi, { number, string } from "joi";
// Models
import { ValidationError } from "./client-errors";
import RoleModel from "./role-model";

class UserModel {
  public userId: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public roleId: RoleModel;

  public constructor(user: UserModel) {
    this.userId = user.userId;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.password = user.password;
    this.roleId = user.roleId;
  }

  // ============ validation

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    userId: Joi.number().forbidden().positive().integer(),
    firstName: Joi.string().required().min(2).max(30),
    lastName: Joi.string().required().min(2).max(50),
    email: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(3).max(256),
    roleId: Joi.number().optional().min(1).max(2),
  });

  public validatePost(): void {
    const result = UserModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }

  // ================= PUT VALIDATION ======================
  private static putValidationSchema = Joi.object({
    userId: Joi.number().required().positive().integer(),
    firstName: Joi.string().required().min(2).max(30),
    lastName: Joi.string().required().min(2).max(50),
    email: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(3).max(256),
    roleId: Joi.number().optional().min(1).max(2),
  });

  public validatePut(): void {
    const result = UserModel.putValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }

  // ================= PATCH VALIDATION ======================
  private static patchValidationSchema = Joi.object({
    userId: Joi.number().required().positive().integer(),
    firstName: Joi.string().optional().min(2).max(30),
    lastName: Joi.string().optional().min(2).max(50),
    email: Joi.string().optional().min(3).max(50),
    password: Joi.string().optional().min(3).max(256),
    roleId: Joi.number().optional().min(1).max(2),
  });

  public validatePatch(): void {
    const result = UserModel.patchValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default UserModel;
