import "./AdminMainVacations.scss";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
// Models
import FilterMenuDataModel from "../../../../Models/FilterMenuDataModel";
import VacationModel from "../../../../Models/VacationModel";
import FollowerModel from "../../../../Models/FollowerModel";
// Services
import vacationsService from "../../../../Services/vacationsService";
import followersService from "../../../../Services/FollowersService";
import notifyService from "../../../../Services/NotifyService";
// Component
import AdminFilterMenu from "../AdminFilterMenu/AdminFilterMenu";
import AdminVacationCard from "../AdminVacationCard/AdminVacationCard";

function AdminMainVacations(): JSX.Element {
  // Get the JWT from storage
  const jwt = localStorage.getItem("token");

  // Decode the JWT and extract the userId from the payload
  const decoded: any = jwt_decode(jwt);
  const userId = +decoded.user.userId;

  // Received data from filter state
  const [receivedData, setReceivedData] = useState<FilterMenuDataModel>(null);

  // Vacations state
  const [vacations, setVacations] = useState<VacationModel[]>([]);

  // Filtered Vacations state
  const [filteredVacations, setFilteredVacations] = useState<VacationModel[]>(
    []
  );

  // Followers state
  const [followers, setFollowers] = useState<FollowerModel[]>([]);

  // Get all Vacations and Followers
  useEffect(() => {
    try {
      vacationsService.getAllVacations().then((dbVacations) => {
        setVacations(dbVacations);
      });

      followersService
        .getAllFollowers()
        .then((dbFollowers) => setFollowers(dbFollowers));
    } catch (err: any) {
      notifyService.error(err);
    }
  }, []);

  // Handle filtered vacations
  useEffect(() => {
    if (receivedData !== null) {
      let filteredVacations = vacations;
      const now = new Date();

      if (
        receivedData.selectedCountry !== null &&
        receivedData.selectedCountry !== 0
      ) {
        filteredVacations = filteredVacations.filter(
          (v) => v.countryId === receivedData.selectedCountry
        );
      } else {
        filteredVacations = vacations;
      }

      if (receivedData.isActive) {
        filteredVacations = filteredVacations.filter(
          (v) =>
            receivedData.isActive ||
            (new Date(v.departureTime) < now && new Date(v.returnTime) > now)
        );
      }

      if (receivedData.isNotStarted) {
        filteredVacations = filteredVacations.filter(
          (v) => receivedData.isNotStarted || new Date(v.departureTime) > now
        );
      }
      setFilteredVacations(filteredVacations);
      setCurrentPage(1);
    }
  }, [receivedData]);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle received data from filter menu
  function handleDataReceived(data: FilterMenuDataModel): void {
    setReceivedData(data);
  }

  // Handle delete vacation
  function handleDeleteVacation(vacationId: number): void {
    const updatedVacations = vacationsToShow.filter(
      (vacation) => vacation.vacationId !== vacationId
    );
    if (receivedData === null) {
      setVacations(updatedVacations);
    } else {
      setFilteredVacations(updatedVacations);
    }
  }

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const vacationsPerPage = 9;
  const totalPages =
    receivedData === null
      ? Math.ceil(vacations.length / vacationsPerPage)
      : Math.ceil(filteredVacations.length / vacationsPerPage);
  const startingIndex = (currentPage - 1) * vacationsPerPage;
  const endingIndex = startingIndex + vacationsPerPage;
  const vacationsToShow =
    receivedData === null
      ? vacations.slice(startingIndex, endingIndex)
      : filteredVacations.slice(startingIndex, endingIndex);

  // Pagination page number array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // ============================= HTML =============================
  return (
    <div className="AdminMainVacations">
      <>
        <AdminFilterMenu onDataSend={handleDataReceived} />

        <div className="vacation-cards">
          {vacationsToShow.map((v) => (
            <AdminVacationCard
              key={v.vacationId}
              vacation={v}
              userId={userId}
              onDeleteVacation={handleDeleteVacation}
            />
          ))}
        </div>

        <div className="pagination">
          {pageNumbers.map((pageNumber) => (
            <button
              className="gold-btn"
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              disabled={currentPage === pageNumber}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </>
    </div>
  );
}

export default AdminMainVacations;
