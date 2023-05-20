import "./EditVacation.scss";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
// Models
import VacationModel from "../../../../Models/VacationModel";
import CountryModel from "../../../../Models/CountryModel";
import AirlineModel from "../../../../Models/AirlineModel";
import LuggageModel from "../../../../Models/LuggageModel";
import BoardModel from "../../../../Models/BoardModel";
import ImageModel from "../../../../Models/ImageModel";
// Services
import vacationsService from "../../../../Services/vacationsService";
import notifyService from "../../../../Services/NotifyService";
import countriesService from "../../../../Services/CountriesService";
import airlinesService from "../../../../Services/AirlinesService";
import luggageService from "../../../../Services/LuggageService";
import boardsService from "../../../../Services/BoardsService";
import imagesService from "../../../../Services/ImagesService";
// Components
import AddCountry from "../AddCountry/AddCountry";
import AddBoard from "../AddBoard/AddBoard";
import AddAirline from "../AddAirline/AddAirline";
import AddLuggage from "../AddLuggage/AddLuggage";
// Icons
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

interface VacationInformationProps {
  vacations: VacationModel;
  images: ImageModel;
}

function EditVacation(props: VacationInformationProps): JSX.Element {
  // Use Form hook
  const { register, handleSubmit, setValue } = useForm<VacationModel>();

  // Countries state
  const [countries, setCountries] = useState<CountryModel[]>([]);

  // Add country state
  const [isAddCountry, setIsAddCountry] = useState<boolean>(false);

  // Airlines state
  const [airlines, setAirlines] = useState<AirlineModel[]>([]);

  // Add airline state
  const [isAddAirline, setIsAddAirline] = useState<boolean>(false);

  // Luggage state
  const [luggage, setLuggage] = useState<LuggageModel[]>([]);

  // Add luggage state
  const [isAddLuggage, setIsAddLuggage] = useState<boolean>(false);

  // Boards state
  const [boards, setBoards] = useState<BoardModel[]>([]);

  // Add boards state
  const [isAddBoard, setIsAddBoard] = useState<boolean>(false);

  // Slider state -> keep tack on image index for slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Image Folder name
  const [imageFolder, setImageFolder] = useState<string>("");

  // images state
  const [sliderImages, setSliderImages] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<FileList[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<ImageModel>();
  const [imagesFolderToDelete, setImagesFolderToDelete] = useState<string>();

  // Get All Countries, Airlines, Luggage
  useEffect(() => {
    try {
      countriesService
        .getAllCountries()
        .then((dbCountries) => setCountries(dbCountries));

      airlinesService
        .getAllAirlines()
        .then((dbAirlines) => setAirlines(dbAirlines));

      luggageService.getAllLuggage().then((dbLuggage) => setLuggage(dbLuggage));

      boardsService.getAllBoards().then((dbBoards) => setBoards(dbBoards));

      if (props.images) {
        if (props.images.imagesUrl) {
          setSliderImages(props.images.imagesUrl);
        }
        if (props.images.imagesFolder) {
          setImageFolder(props.images.imagesFolder);
          setImagesToDelete({
            imagesFolder: props.images.imagesFolder,
            imagesUrl: [],
          });
        }
      }
    } catch (err: any) {
      notifyService.error(err);
    }
  }, []);

  // Formatting date to enable set value
  function formattingDate(propsDate: string): string {
    const date = new Date(propsDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const localTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    return localTimeString;
  }

  // Set Vacation information inside inputs
  useEffect(() => {
    setValue("countryId", props.vacations.countryId);
    const folderName =
      props.vacations.imagesFolder ||
      props.vacations.hotel.toLocaleLowerCase().replace(/\s+/g, "-");
    setImageFolder(folderName);
    setValue("imagesFolder", folderName);
    setValue("city", props.vacations.city);
    setValue("hotel", props.vacations.hotel);
    setValue("starsId", props.vacations.starsId);
    setValue("boardId", props.vacations.boardId);
    setValue("departureTime", formattingDate(props.vacations.departureTime));
    setValue("returnTime", formattingDate(props.vacations.returnTime));
    setValue("airlineId", props.vacations.airlineId);
    setValue("luggageId", props.vacations.luggageId);
    setValue("description", props.vacations.description);
    setValue("price", props.vacations.price);
  }, []);

  // Set image folder name
  function setImageFolderName(arg: ChangeEvent<HTMLInputElement>): void {
    const name = arg.target.value;
    const folderName = name.toLocaleLowerCase().replace(/\s+/g, "-");
    setImageFolder(folderName);
    setValue("imagesFolder", folderName);
  }

  // Handle added checkbox - for missing selection options
  function handleAddCountry(): void {
    setIsAddCountry(!isAddCountry);
  }
  function handleAddBoard(): void {
    setIsAddBoard(!isAddBoard);
  }
  function handleAddAirline(): void {
    setIsAddAirline(!isAddAirline);
  }
  function handleAddLuggage(): void {
    setIsAddLuggage(!isAddLuggage);
  }

  // Handel uploaded images
  function handleUploadImages(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const imagesList = event.target.files;
    setUploadedImages([...[imagesList]]);
    const imageUrls: string[] = [];
    Array.from(imagesList).forEach((image) => {
      imageUrls.push(URL.createObjectURL(image));
    });
    setSliderImages(imageUrls);
  }

  // Handel delete image
  const newImagesUrl = sliderImages;

  function handleDeleteImage(imageUrl: string): void {
    const indexToDelete = newImagesUrl.findIndex((url) => url === imageUrl);
    if (indexToDelete !== -1) {
      newImagesUrl.splice(indexToDelete, 1);
      setSliderImages(newImagesUrl);
      setImagesToDelete((prevState) => ({
        ...prevState,
        imagesUrl: [...prevState.imagesUrl, imageUrl],
      }));
    }
  }

  // Handle delete all images
  function handleDeleteAllImages(): void {
    delete props.images.imagesFile;
    const imagesFolder = props.images.imagesFolder;
    setImagesFolderToDelete(imagesFolder);
  }

  // Send edited vacation and images to server
  async function send(vacation: VacationModel): Promise<void> {
    try {
      if (imagesFolderToDelete) {
        await imagesService.deleteAllImage(imagesFolderToDelete);
      }
      if (imagesToDelete && imagesToDelete.imagesUrl.length > 0) {
        await imagesService.deleteImage(imagesToDelete);
      }
      if (uploadedImages && uploadedImages.length > 0) {
        await imagesService.addImage(uploadedImages, imageFolder);
      }

      await vacationsService.editVacation(vacation);
      notifyService.success("success");
      window.location.reload();
    } catch (err: any) {
      console.log(err);
    }
  }

  // Slider controls
  function goToNextSlide(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setCurrentImageIndex(
      currentImageIndex === sliderImages.length - 1 ? 0 : currentImageIndex + 1
    );
  }

  function goToPrevSlide(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setCurrentImageIndex(
      currentImageIndex === 0 ? sliderImages.length - 1 : currentImageIndex - 1
    );
  }

  return (
    <div className="EditVacation">∑
      <h2>Edit vacation</h2>

      <form onSubmit={handleSubmit(send)}>
        <input
          type="hidden"
          {...register("vacationId", { value: props.vacations.vacationId })}
        />

        <label>Images Folder Name:</label>
        <input
          type="string"
          {...register("imagesFolder")}
          required
          max={30}
          disabled
        />

        <label>Images Files:</label>
        <div className="images-handler-btns">
          <button
            type="button"
            className="danger-btn delete-all-images"
            onClick={handleDeleteAllImages}
          >
            Delete all images
          </button>
          <input
            type="file"
            className="upload-images"
            name="imagesFile"
            accept="image/*"
            onChange={handleUploadImages}
            multiple
          />
        </div>

        <div className="slider">
          <div className="slider-container">
            {sliderImages.length === 0 ? (
              <div className="place-holder">
                {" "}
                <p>Place Holder</p>{" "}
              </div>
            ) : (
              sliderImages.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`slider-image ${
                    index === currentImageIndex ? "active" : "hidden"
                  }`}
                >
                  <button
                    type="button"
                    className="delete-image danger-btn"
                    onClick={() => handleDeleteImage(imageUrl)}
                  >
                    <RiDeleteBin6Line />
                  </button>
                  <img src={imageUrl} alt={props.vacations.hotel} />
                </div>
              ))
            )}
          </div>

          <div className="slider-controls">
            <button onClick={goToPrevSlide}>
              <FiArrowLeftCircle />
            </button>
            <button onClick={goToNextSlide}>
              <FiArrowRightCircle />
            </button>
          </div>
        </div>

        <label>Country:</label>
        <select
          defaultValue={props.vacations.countryId}
          {...register("countryId", { valueAsNumber: true })}
          required
        >
          {countries.map((c) => (
            <option key={c.countryId} value={c.countryId}>
              {c.countryName}
            </option>
          ))}
        </select>

        <div className="add-checkbox">
          <input
            type="checkbox"
            onChange={handleAddCountry}
            checked={isAddCountry}
          />
          <label>Add Country:</label>
        </div>
        {isAddCountry && <AddCountry onClick={handleAddCountry} />}

        <label>City:</label>
        <input type="string" {...register("city")} required min={3} max={30} />

        <label>Hotel:</label>
        <input
          type="string"
          {...register("hotel")}
          onChange={setImageFolderName}
          required
          min={3}
          max={50}
        />

        <label>Stars Rating:</label>
        <select
          defaultValue={props.vacations.starsId}
          {...register("starsId", { valueAsNumber: true })}
          required
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <label>Board:</label>
        <select
          defaultValue={props.vacations.boardId}
          {...register("boardId", { valueAsNumber: true })}
          required
        >
          {boards.map((b) => (
            <option key={b.boardId} value={b.boardId}>
              {b.boardName}
            </option>
          ))}
        </select>

        <div className="add-checkbox">
          <input
            type="checkbox"
            onChange={handleAddBoard}
            checked={isAddBoard}
          />
          <label>Add Board:</label>
        </div>
        {isAddBoard && <AddBoard onClick={handleAddBoard} />}

        <label>Departure Time:</label>
        <input
          type="datetime-local"
          {...register("departureTime", { valueAsNumber: false })}
          min={new Date().toISOString().slice(0, -8)}
          required
        />

        <label>Return Time:</label>
        <input
          type="datetime-local"
          {...register("returnTime", { valueAsNumber: false })}
          min={new Date().toISOString().slice(0, -8)}
          required
        />

        <label>Airline:</label>
        <select
          defaultValue={props.vacations.airlineId}
          {...register("airlineId", { valueAsNumber: true })}
          required
        >
          {airlines.map((a) => (
            <option key={a.airlineId} value={a.airlineId}>
              {a.airlineName}
            </option>
          ))}
        </select>

        <div className="add-checkbox">
          <input
            type="checkbox"
            onChange={handleAddAirline}
            checked={isAddAirline}
          />
          <label>Add Airline:</label>
        </div>
        {isAddAirline && <AddAirline onClick={handleAddAirline} />}

        <label>Luggage:</label>
        <select
          defaultValue={props.vacations.luggageId}
          {...register("luggageId", { valueAsNumber: true })}
          required
        >
          {luggage.map((l) => (
            <option key={l.luggageId} value={l.luggageId}>
              {l.luggageName}
            </option>
          ))}
        </select>

        <div className="add-checkbox">
          <input
            type="checkbox"
            onChange={handleAddLuggage}
            checked={isAddLuggage}
          />
          <label>Add Luggage:</label>
        </div>
        {isAddLuggage && <AddLuggage onClick={handleAddLuggage} />}

        <label>Description:</label>
        <textarea
          {...register("description")}
          required
          minLength={10}
          maxLength={1000}
        />

        <label>Price:</label>
        <input
          type="number"
          {...register("price", { valueAsNumber: true })}
          required
          min={1}
          max={10000}
        />

        <button className="blue-btn send-edit">Send</button>
      </form>
    </div>
  );
}

export default EditVacation;
