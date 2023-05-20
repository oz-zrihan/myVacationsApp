import Joi from "joi";
// Models
import { ValidationError } from "./client-errors";

class FollowerModel {
  public vacationId: number;
  public userId: number;

  public constructor(follower: FollowerModel) {
    this.vacationId = follower.vacationId;
    this.userId = follower.userId;
  }

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    vacationId: Joi.number().required().positive().integer(),
    userId: Joi.number().required().positive().integer(),
  });

  public validatePost(): void {
    const result = FollowerModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default FollowerModel;
