import "./AdminVacationCard.scss";
import { useEffect, useState } from "react";
// Models
import ImageModel from "../../../../Models/ImageModel";
import VacationModel from "../../../../Models/VacationModel";
// Services
import imagesService from "../../../../Services/ImagesService";
import notifyService from "../../../../Services/NotifyService";
import vacationsService from "../../../../Services/vacationsService";
// Component
import AdminFollowers from "../AdminFollowers/AdminFollowers";
import EditVacation from "../EditVacation/EditVacation";
// Icons
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";
import { BsCalendarEvent, BsClockHistory } from "react-icons/bs";
import { GiCommercialAirplane } from "react-icons/gi";
import { MdOutlineLuggage } from "react-icons/md";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";

interface VacationCardProps {
  vacation: VacationModel;
  userId: number;
  onDeleteVacation: (vacationId: number) => void;
}

function AdminVacationCard(props: VacationCardProps): JSX.Element {
  // Filter data to send to parent
  const { onDeleteVacation } = props;

  // Images URL state
  const [images, setImages] = useState<ImageModel>();

  // Slider state -> keep tack on image index for slider
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Expand state -> expended if true
  const [isExpanded, setIsExpanded] = useState(false);

  // isEditMode state
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // isDelete state
  const [isDeleteMassage, setIsDeleteMassage] = useState<boolean>(false);

  // isDeleteVerification state
  const [isDeleteVerification, setIsDeleteVerification] = useState<boolean>(false);

  // Get images Url
  useEffect(() => {
    imagesService
      .getAllImages(props.vacation.imagesFolder)
      .then((dbImages) => {
        setImages(dbImages);
      })
      .catch((err) => notifyService.error(err));
  }, [images]);

  // Handle expand:
  function handleExpand(): void {
    setIsExpanded(!isExpanded);
  }
  // Handle edit:
  function handleEdit(): void {
    setIsEdit(!isEdit);
  }
  // Handle delete:
  function handleDeleteErrorMassage(): void {
    setIsDeleteMassage(true);
  }

  // Handle accept delete
  function handelAcceptDelete(): void {
    setIsDeleteVerification(false);
    setIsDeleteMassage(true);
    if (isDeleteMassage) {
      vacationsService.deleteVacation(props.vacation.vacationId);
      imagesService.deleteAllImage(props.vacation.imagesFolder);
    }
    onDeleteVacation(props.vacation.vacationId);
    setIsDeleteMassage(false);
  }

  // Handle cancel delete
  function handelCancelDelete(): void {
    setIsDeleteMassage(false);
  }

  // formatting date to more readable format
  function formatDate(dateString: string): { date: string; time: string } {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date: formattedDate, time: formattedTime };
  }

  // Slider controls
  function goToNextSlide(): void {
    setCurrentImageIndex(
      currentImageIndex === images.imagesUrl.length - 1
        ? 0
        : currentImageIndex + 1
    );
  }

  function goToPrevSlide(): void {
    setCurrentImageIndex(
      currentImageIndex === 0
        ? images.imagesUrl.length - 1
        : currentImageIndex - 1
    );
  }

  // Create stars rating
  const stars = [];
  for (let j = 0; j < props.vacation.starsId; j++) {
    stars.push(
      <span key={j} className="checked">
        <AiFillStar />
      </span>
    );
  }
  for (let i = 0; i < 5 - props.vacation.starsId; i++) {
    stars.push(
      <span key={i + props.vacation.starsId} className="not-checked">
        <AiOutlineStar />
      </span>
    );
  }

  // ============================= HTML =============================
  return (
    <div className="AdminVacationCard">
      {isDeleteMassage && (
        <div className="delete-verification">
          <h2> Are you sure you want to delete this vacation?</h2>
          <p>
            {" "}
            Notice that you will lose all vacation information from database and
            all images
          </p>
          <button className="gold-btn" onClick={handelAcceptDelete}>
            {" "}
            Accept
          </button>
          <button className="danger-btn" onClick={handelCancelDelete}>
            {" "}
            Cancel
          </button>
        </div>
      )}
      {props.vacation && isEdit ? (
        <>
          <button onClick={handleEdit} className="blue-btn close-edit">
            {" "}
            Cancel{" "}
          </button>
          <EditVacation vacations={props.vacation} images={images} />
        </>
      ) : (
        <>
          <button onClick={handleDeleteErrorMassage} className="danger-btn">
            {" "}
            Delete{" "}
          </button>
          <button onClick={handleEdit} className="gold-btn edit-vacation">
            {" "}
            Edit{" "}
          </button>
          <AdminFollowers
            key={props.vacation.vacationId}
            vacationId={props.vacation.vacationId}
            userId={props.userId}
          />
          <div className="slider">
            <div className="slider-container">
              {images &&
                images.imagesUrl.map((image, index) => (
                  <div
                    key={index}
                    className={`slider-image ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                  >
                    <img src={image} alt={props.vacation.hotel} />
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
          <div className="card-header">
            <h3>{props.vacation.countryName}</h3>
            <h2>{props.vacation.city}</h2>
          </div>
          <div className="card-body">
            <h3 className="hotel-name">{props.vacation.hotel}</h3>
            <span> {stars}</span>
            <p className="board">{props.vacation.boardName} included</p>
            {isExpanded ? (
              <div className="card-content-expanded">
                <div className="card-table">
                  <div className="card-table-header">
                    <GiAirplaneDeparture /> Departure
                  </div>
                  <div className="card-table-header">
                    <GiAirplaneArrival /> Return
                  </div>

                  <div className="card-table-item">
                    <div>
                      <BsCalendarEvent />
                      {formatDate(props.vacation.departureTime).date}
                    </div>
                    <div>
                      <BsClockHistory />
                      {formatDate(props.vacation.departureTime).time}
                    </div>
                    <div>
                      <GiCommercialAirplane />
                      {props.vacation.airlineName}
                    </div>
                    <div>
                      <MdOutlineLuggage />
                      {props.vacation.luggageName}
                    </div>
                  </div>

                  <div className="card-table-item">
                    <div>
                      <BsCalendarEvent />
                      {formatDate(props.vacation.returnTime).date}
                    </div>
                    <div>
                      <BsClockHistory />
                      {formatDate(props.vacation.returnTime).time}
                    </div>
                    <div>
                      <GiCommercialAirplane />
                      {props.vacation.airlineName}
                    </div>
                    <div>
                      <MdOutlineLuggage />
                      {props.vacation.luggageName}
                    </div>
                  </div>
                </div>

                <p>{props.vacation.description}</p>

                <button className="blue-btn read-less" onClick={handleExpand}>
                  Read less
                </button>
              </div>
            ) : (
              <div className="card-content-preview">
                <div className="card-table">
                  <div className="card-table-header">
                    <GiAirplaneDeparture /> Departure
                  </div>
                  <div className="card-table-header">
                    <GiAirplaneArrival /> Return
                  </div>

                  <div className="card-table-item">
                    <div>
                      <BsCalendarEvent />
                      {formatDate(props.vacation.departureTime).date}
                    </div>
                  </div>

                  <div className="card-table-item">
                    <div>
                      <BsCalendarEvent />
                      {formatDate(props.vacation.returnTime).date}
                    </div>
                  </div>
                </div>

                <p>
                  {props.vacation.description.substring(0, 100)}
                  {props.vacation.description.length > 100 && "..."}
                </p>

                <button className="gold-btn read-more" onClick={handleExpand}>
                  Read more
                </button>
              </div>
            )}

            <h2>{props.vacation.price}$</h2>
            <p>For a couple</p>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminVacationCard;
