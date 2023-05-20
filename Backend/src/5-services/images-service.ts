import { OkPacket } from "mysql";
// Model
import { ResourceNotFoundError } from "../2-models/client-errors";
import ImageModel from "../2-models/image-Model";
// Utils
import imageHandler from "../4-utils/image-handler";
import dal from "../4-utils/dal";

//  ====================== Get all images path from specific folder ======================
async function getAllImagesPath(imageFolder: string): Promise<ImageModel> {
  // Get images path from folder
  const images = await imageHandler.getAllImagesPath(imageFolder);

  return images;
}

//  ====================== Get image file from specific folder ======================
async function getImageUrl(
  imageFolder: string,
  imageName: string
): Promise<string> {
  // Get images file from folder
  const image = await imageHandler.getImagePath(imageFolder, imageName);

  // Error if not exist
  if (!image) {
    throw new ResourceNotFoundError(imageName);
  }

  return image;
}
//  ====================== Add images file from specific folder ======================
async function addImage(images: ImageModel): Promise<ImageModel> {
  // Image validation
  images.validateImage();
  images.validatePost();

  // Save image to local folder
  const UploadedImages = await imageHandler.saveImages(
    images.imagesFile,
    images.imagesFolder
  );

  return UploadedImages;
}

//  ====================== Delete images file from specific folder ======================
async function deleteImage(
  imagesUrl: string[],
  imagesFolder: string
): Promise<void> {
  // Delete images from server
  await imageHandler.deleteImages(imagesUrl, imagesFolder);
}

//  ====================== Delete images folder ======================
async function deleteImagesFolder(imagesFolder: string): Promise<void> {
  // Delete all images folder from serve
  await imageHandler.deleteImagesFolder(imagesFolder);

  // check if folder exist in DB -> for cases that the vacation was deleted
  const sqlCheckIfExist = `
                            SELECT COUNT(*) as count 
                            FROM vacations 
                            WHERE imagesFolder = ?
                            `;
  const result: OkPacket = await dal.execute(sqlCheckIfExist, [imagesFolder]);
  const count = result[0].count;

  if (count > 0) {
    // Query
    const sql = `UPDATE vacations SET imagesFolder = null WHERE imagesFolder= ? `;

    // Execute:
    await dal.execute(sql, [imagesFolder]);
  }
}

export default {
  getAllImagesPath,
  getImageUrl,
  addImage,
  deleteImage,
  deleteImagesFolder,
};
