import Joi, { number, string } from "joi";
// Models
import { ValidationError } from "./client-errors";

class CountryModel {
  public constructor(public countryId: number, public countryName: string) {}

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    countryId: Joi.number().forbidden().positive().integer(),
    countryName: Joi.string().required().min(3).max(30),
  });

  public validatePost(): void {
    const result = CountryModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default CountryModel;
