import "./EditHeader.scss";
import { useEffect, useState } from "react";
import { imagesStore } from "../../../Redux/ImagesState";
// Models
import ImageModel from "../../../Models/ImageModel";
// Services
import imagesService from "../../../Services/ImagesService";
import notifyService from "../../../Services/NotifyService";

function EditHeader(): JSX.Element {
  //images state
  const [images, setImages] = useState<ImageModel>();

  // Last update state - for forcing rerender
  const [lastUpdate, setLastUpdate] = useState<number>();

  // Get all header images from server
  useEffect(() => {
    imagesService
      .getAllImages("header")
      .then((dbImages) => setImages(dbImages))
      .catch((err) => notifyService.error(err));

    // Subscribe for changes
    const unsubscribe = imagesStore.subscribe(() => {
      const newImages = imagesStore.getState().imagesByFolder[0];
      const timeStamp = Date.now();
      setImages(newImages);
      setLastUpdate(timeStamp);
    });

    // Return the cleanup function
    return () => {
      unsubscribe();
    };
  }, []);

  // Handel uploaded images
  function handleUploadImages(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const imagesList = event.target.files;
    imagesService.addImage([...[imagesList]], "header");
  }

  // Handle delete image
  function handleDeleteImage(imageToDelete: ImageModel): void {
    imagesService.deleteImage(imageToDelete);
  }

  // Handle delete all images
  function handleDeleteAllImages(): void {
    imagesService.deleteAllImage(images.imagesFolder);
  }

  return (
    <div className="EditHeader">
      <div className="images-handler-btns">
        <button
          type="button"
          className="danger-btn delete-all-images"
          onClick={handleDeleteAllImages}
        >
          Delete all images
        </button>
        <div className="upload-images-wrapper blue-btn">
          <input
            type="file"
            className="upload-images"
            name="uploadInput"
            accept="image/*"
            onChange={handleUploadImages}
            multiple
          />
          <label className="upload-label" htmlFor="uploadInput">
            Upload images
          </label>
        </div>
      </div>

      <div className="images-gallery">
        {images &&
          images.imagesUrl.map((image, index) => (
            <div className="image-box" key={index}>
              <button
                className="danger-btn"
                onClick={() =>
                  handleDeleteImage({
                    imagesFolder: images.imagesFolder,
                    imagesUrl: [image],
                  })
                }
              >
                Delete
              </button>
              <img src={image} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default EditHeader;
