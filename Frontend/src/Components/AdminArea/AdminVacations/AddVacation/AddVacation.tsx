import "./AddVacation.scss";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Models
import VacationModel from "../../../../Models/VacationModel";
import CountryModel from "../../../../Models/CountryModel";
import AirlineModel from "../../../../Models/AirlineModel";
import LuggageModel from "../../../../Models/LuggageModel";
import BoardModel from "../../../../Models/BoardModel";
// Services
import boardsService from "../../../../Services/BoardsService";
import vacationsService from "../../../../Services/vacationsService";
import notifyService from "../../../../Services/NotifyService";
import countriesService from "../../../../Services/CountriesService";
import airlinesService from "../../../../Services/AirlinesService";
import luggageService from "../../../../Services/LuggageService";
import imagesService from "../../../../Services/ImagesService";
// Components
import AddCountry from "../AddCountry/AddCountry";
import AddBoard from "../AddBoard/AddBoard";
import AddAirline from "../AddAirline/AddAirline";
import AddLuggage from "../AddLuggage/AddLuggage";
// Icons
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { MdFreeCancellation } from "react-icons/md";

function AddVacation(): JSX.Element {
  // use navigate
  const navigate = useNavigate();

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

  // Image Folder name
  const [imageFolder, setImageFolder] = useState<string>("");

  // images state
  const [uploadedImages, setUploadedImages] = useState<FileList[]>([]);

  // Slider state -> keep tack on image index for slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get All Countries, Airlines, Luggage and Boards
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
    } catch (err: any) {
      notifyService.error(err);
    }
  }, []);

  // Set image folder name
  function setImageFolderName(arg: ChangeEvent<HTMLInputElement>): void {
    const name = arg.target.value;
    const folderName = name.toLocaleLowerCase().replace(/\s+/g, "-");
    setImageFolder(folderName);
    setValue("imagesFolder", folderName);
  }

  // Handel uploaded images
  function handleUploadImages(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const imagesList = event.target.files;
    setUploadedImages([...[imagesList]]);
  }

  // Handel added checkbox - for missing selection options
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

  // Send added vacation and images to server
  async function send(vacation: VacationModel): Promise<void> {
    try {
      if (uploadedImages) {
        await imagesService.addImage(uploadedImages, imageFolder);
      }
      await vacationsService.addVacation(vacation);
      notifyService.success("success");
      navigate("/admin-vacations");
    } catch (err: any) {
      alert(err);
    }
  }

  // Slider controls for images carousel
  function goToNextSlide(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setCurrentImageIndex(
      currentImageIndex === uploadedImages[0].length - 1
        ? 0
        : currentImageIndex + 1
    );
  }

  function goToPrevSlide(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    setCurrentImageIndex(
      currentImageIndex === 0
        ? uploadedImages[0].length - 1
        : currentImageIndex - 1
    );
  }
  return (
    <div className="AddVacation">
      <div className="add-vacation-title">
        <h2>Add vacation</h2>
        <NavLink to="/admin-vacations">
          {" "}
          <button className="blue-btn">
            <MdFreeCancellation />
          </button>
        </NavLink>
      </div>

      <form onSubmit={handleSubmit(send)}>
        <input type="hidden" {...register("vacationId")} />

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
          <input
            type="file"
            className="upload-images"
            accept="image/*"
            onChange={handleUploadImages}
            multiple
          />
        </div>

        <div className="slider">
          <div className="slider-container">
            {uploadedImages.map((fileList, index) => (
              <div key={index}>
                {Array.from(fileList).map((image, subIndex) => (
                  <div
                    key={subIndex}
                    className={`slider-image ${
                      subIndex === currentImageIndex ? "active" : ""
                    }`}
                  >
                    <img src={URL.createObjectURL(image)} />
                  </div>
                ))}
              </div>
            ))}
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
          defaultValue=""
          {...register("countryId", { valueAsNumber: true })}
          required
        >
          <option disabled value="">
            Select a country
          </option>
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
          required
          min={3}
          max={50}
          onChange={setImageFolderName}
        />

        <label>Stars Rating:</label>
        <select
          defaultValue=""
          {...register("starsId", { valueAsNumber: true })}
          required
        >
          <option disabled value="">
            Select hotel rating
          </option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>

        <label>Board:</label>
        <select
          defaultValue=""
          {...register("boardId", { valueAsNumber: true })}
          required
        >
          <option disabled value="">
            Select hotel board option
          </option>
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
          defaultValue=""
          {...register("airlineId", { valueAsNumber: true })}
          required
        >
          <option disabled value="">
            Select airline
          </option>
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
          defaultValue=""
          {...register("luggageId", { valueAsNumber: true })}
          required
        >
          <option disabled value="">
            Select airline luggage option
          </option>
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

export default AddVacation;
