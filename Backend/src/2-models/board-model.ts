import Joi, { number, string } from "joi";
// Models
import { ValidationError } from "./client-errors";

class BoardModel {
  public constructor(public boardId: number, public boardName: string) {}

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    boardId: Joi.number().forbidden().positive().integer(),
    boardName: Joi.string().required().min(3).max(30),
  });

  public validatePost(): void {
    const result = BoardModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default BoardModel;
