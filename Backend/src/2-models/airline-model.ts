import Joi, { number, string } from "joi";
// Models
import { ValidationError } from "./client-errors";

class AirlineModel {
  public constructor(public airlineId: number, public airlineName: string) {}

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    airlineId: Joi.number().forbidden().positive().integer(),
    airlineName: Joi.string().required().min(3).max(30),
  });

  public validatePost(): void {
    const result = AirlineModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default AirlineModel;
