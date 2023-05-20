// Models
import Joi, { number, string } from "joi";
import { ValidationError } from "./client-errors";

class LuggageModel {
  public constructor(public luggageId: number, public luggageName: string) {}

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    luggageId: Joi.number().forbidden().positive().integer(),
    luggageName: Joi.string().required().min(3).max(30),
  });

  public validatePost(): void {
    const result = LuggageModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default LuggageModel;
