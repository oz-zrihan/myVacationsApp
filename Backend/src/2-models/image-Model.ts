import { UploadedFile } from "express-fileupload";
import Joi from "joi";
// Models
import { ValidationError } from "./client-errors";

class ImageModel {
  public imagesFolder: string;
  public imagesUrl?: string[];
  public imagesFile: UploadedFile[];

  public constructor(image: {
    imagesFolder: string;
    imagesUrl?: string[];
    imagesFile: UploadedFile[];
  }) {
    this.imagesFolder = image.imagesFolder;
    this.imagesUrl = image.imagesUrl;
    this.imagesFile = image.imagesFile;
  }

  // ============ validation

  // ================= IMAGE VALIDATION ====================

  private static imageValidationSchema = Joi.object({
    name: Joi.string()
      .pattern(/\.jpg$|\.jpeg$|\.png$|\.bmp$|\.webp$|\.svg$/i)
      .required(),
    mimetype: Joi.string()
      .pattern(/^image\/(jpg|jpeg|png|bmp|webp|svg\+xml)$/i)
      .required(),
    size: Joi.number().required(),
  });

  public validateImage(): void {
    for (let i = 0; i < this.imagesFile.length; i++) {
      const result = ImageModel.imageValidationSchema.validate({
        name: this.imagesFile[i].name,
        mimetype: this.imagesFile[i].mimetype,
        size: this.imagesFile[i].size,
      });

      if (result.error) throw new ValidationError(result.error.message);
    }
  }

  // ================= POST VALIDATION ======================
  private static postValidationSchema = Joi.object({
    imagesFolder: Joi.string().required().min(3).max(30),
    imagesUrl: Joi.string().optional(),
    imagesFile: Joi.any(),
  });

  public validatePost(): void {
    const result = ImageModel.postValidationSchema.validate(this);
    if (result.error) throw new ValidationError(result.error.message);
  }
}

export default ImageModel;
