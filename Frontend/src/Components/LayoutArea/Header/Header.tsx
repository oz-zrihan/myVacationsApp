import "./Header.scss";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { imagesStore } from "../../../Redux/ImagesState";
// Models
import ImageModel from "../../../Models/ImageModel";
// Services
import authService from "../../../Services/AuthService";
import imagesService from "../../../Services/ImagesService";
import notifyService from "../../../Services/NotifyService";

function Header(): JSX.Element {
  // Images state
  const [images, setImages] = useState<ImageModel>(null);
  const [lastUpdate, setLastUpdate] = useState<number>();

  // Current image index state
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Is admin state -> for edit header
  const isAdmin = authService.isAdmin();

  // Get all header images
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

  // Set interval for images change
  useEffect(() => {
    setCurrentImageIndex(0);
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (currentIndex) => (currentIndex + 1) % images?.imagesUrl.length
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [images, lastUpdate]);

  // ============================= HTML =============================
  return (
    <div className="Header">
      {isAdmin && (
        <NavLink to={"/edit-header"}>
          <button className="gold-btn"> Edit Header</button>
        </NavLink>
      )}

      <div className="image-container">
        {images &&
          images.imagesUrl.map((url, index) => (
            <div
              key={index}
              className={`image ${
                index === currentImageIndex ? " active" : ""
              }`}
              style={{ backgroundImage: `url(${url})` }}
            ></div>
          ))}
      </div>
    </div>
  );
}

export default Header;
