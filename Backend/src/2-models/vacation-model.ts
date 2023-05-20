import Joi, { number, string } from "joi";
// Models
import { ValidationError } from "./client-errors";
import FollowerModel from "./follower-model";

class VacationModel {
  public vacationId: number;
  public countryId: number;
  public city: string;
  public hotel: string;
  public starsId: number;
  public boardId?: number;
  public airlineId: number;
  public luggageId?: number;
  public departureTime: string;
  public returnTime: string;
  public price: number;
  public description: string;
  public imagesFolder: string;
  public followers: FollowerModel;

  //for join tables
  public countryName?: string;
  public boardName?: string;
  public airlineName?: string;
  public luggageName?: string;

  public constructor(vacation: VacationModel) {
    this.vacationId = +vacation.vacationId;
    this.countryId = +vacation.countryId;
    this.city = vacation.city;
    this.hotel = vacation.hotel;
    this.starsId = +vacation.starsId;
    this.boardId = +vacation.boardId;
    this.airlineId = +vacation.airlineId;
    this.luggageId = +vacation.luggageId;
    this.departureTime = vacation.departureTime;
    this.returnTime = vacation.returnTime;
    this.price = +vacation.price;
    this.description = vacation.description;
    this.imagesFolder = vacation.imagesFolder;
  }

  // ============ validation

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    vacationId: Joi.number().forbidden().positive().integer(),
    countryId: Joi.number().required().positive().integer(),
    city: Joi.string().required().min(3).max(30),
    hotel: Joi.string().required().min(3).max(50),
    starsId: Joi.number().required().positive().integer(),
    boardId: Joi.number().required().positive().integer(),
    airlineId: Joi.number().required().positive().integer(),
    luggageId: Joi.number().required().positive().integer(),
    departureTime: Joi.string().required(),
    returnTime: Joi.string().required(),
    price: Joi.number().required().min(1).max(10000),
    description: Joi.string().required().min(10).max(1000),
    imagesFolder: Joi.string().required().max(30),
  });

  public validatePost(): void {
    const result = VacationModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }

  // ================= PUT VALIDATION ======================
  private static putValidationSchema = Joi.object({
    vacationId: Joi.number().required().positive().integer(),
    countryId: Joi.number().required().positive().integer(),
    city: Joi.string().required().min(3).max(30),
    hotel: Joi.string().required().min(3).max(50),
    starsId: Joi.number().required().positive().integer(),
    boardId: Joi.number().required().positive().integer(),
    airlineId: Joi.number().required().positive().integer(),
    luggageId: Joi.number().required().positive().integer(),
    departureTime: Joi.string().required(),
    returnTime: Joi.string().required(),
    price: Joi.number().required().min(1).max(10000),
    description: Joi.string().required().min(10).max(1000),
    imagesFolder: Joi.string().required().max(30),
  });

  public validatePut(): void {
    const result = VacationModel.putValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }

  // ================= PATCH VALIDATION ======================
  private static patchValidationSchema = Joi.object({
    vacationId: Joi.number().required().positive().integer(),
    countryId: Joi.number().optional().positive().integer(),
    city: Joi.string().optional().min(3).max(30),
    hotel: Joi.string().optional().min(3).max(50),
    starsId: Joi.number().optional().positive().integer(),
    boardId: Joi.number().optional().positive().integer(),
    airlineId: Joi.number().optional().positive().integer(),
    luggageId: Joi.number().optional().positive().integer(),
    departureTime: Joi.string().optional(),
    returnTime: Joi.string().optional(),
    price: Joi.number().optional().min(1).max(10000),
    description: Joi.string().optional().min(10).max(1000),
    imagesFolder: Joi.string().optional().max(30),
  });

  public validatePatch(): void {
    const result = VacationModel.patchValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default VacationModel;
