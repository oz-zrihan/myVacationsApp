import Joi, {string } from "joi";
// Models
import { ValidationError } from "./client-errors";

class CredentialsModel {
  public email: string;
  public password: string;

  public constructor(credentials: CredentialsModel) {
    this.email = credentials.email;
    this.password = credentials.password;
  }

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    email: Joi.string().required().min(3).max(50),
    password: Joi.string().required().min(4).max(256),
  });

  public validatePost(): void {
    const result = CredentialsModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default CredentialsModel;
