import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import "./MainVacations.scss";
// Models
import FollowerModel from "../../../../Models/FollowerModel";
import VacationModel from "../../../../Models/VacationModel";
import FilterMenuDataModel from "../../../../Models/FilterMenuDataModel";
// Services
import notifyService from "../../../../Services/NotifyService";
import vacationsService from "../../../../Services/vacationsService";
import followersService from "../../../../Services/FollowersService";
// Component
import VacationCard from "../VacationCard/VacationCard";
import FilterMenu from "../FilterMenu/FilterMenu";
import LoadScreen from "../../../LayoutArea/loadScreen/LoadScreen";

function MainVacations(): JSX.Element {
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
  const [filteredVacations, setFilteredVacations] = useState<VacationModel[]>([]);

  // Followers state
  const [followers, setFollowers] = useState<FollowerModel[]>([]);

  // loader state
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // current page state
  const [currentPage, setCurrentPage] = useState(1);

  // Get all Vacations and Followers
  useEffect(() => {
    setIsLoading(true);
    try {
      vacationsService.getAllVacations().then((dbVacations) => {
        setVacations(dbVacations);
      });

      followersService
        .getAllFollowers()
        .then((dbFollowers) => setFollowers(dbFollowers));
    } catch (err: any) {
      notifyService.error(err);
    } finally {
    }
  }, []);

  // Handle filtered vacations
  useEffect(() => {
    if (receivedData !== null) {
      let filteredVacations = vacations;
      const now = new Date();

      // If receiving country yo sort by
      if (
        receivedData.selectedCountry !== null &&
        receivedData.selectedCountry !== 0
      ) {
        filteredVacations = filteredVacations.filter(
          (v) => v.countryId === receivedData.selectedCountry
        );
      }

      // If receiving price to sort by
      if (receivedData.sortByPrice < 10000) {
        filteredVacations = filteredVacations.filter(
          (v) => v.price < receivedData.sortByPrice
        );
      }

      // If receiving rating to sort by -> show vacations up to selected rating
      if (receivedData.sortByStarRating > 0) {
        console.log(receivedData.sortByStarRating);

        filteredVacations = filteredVacations.filter(
          (v) => v.starsId <= receivedData.sortByStarRating
        );
      }

      // If receiving isFollowing - to show only followed vacations
      if (receivedData.isFollowing) {
        const followedVacations = followers.filter((f) => f.userId === userId);
        const followedVacationIds = followedVacations.map((f) => f.vacationId);
        filteredVacations = filteredVacations.filter((v) =>
          followedVacationIds.includes(v.vacationId)
        );
      }

      // If receiving isActive - to show only active vacation
      if (receivedData.isActive) {
        filteredVacations = filteredVacations.filter(
          (v) =>
            receivedData.isActive ||
            (new Date(v.departureTime) < now && new Date(v.returnTime) > now)
        );
      }

      // If receiving isNotStarted - to show only vacation that yet to be started
      if (receivedData.isNotStarted) {
        filteredVacations = filteredVacations.filter(
          (v) => receivedData.isNotStarted || new Date(v.departureTime) > now
        );
      }
      setFilteredVacations(filteredVacations);
    }
  }, [receivedData]);
  
  
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);    
  };

  // Handle received data from filter menu
  function handleDataReceived(data: FilterMenuDataModel): void {
    setReceivedData(data);
    handlePageChange(1)
  }

  // Pagination logic
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

  // Clear loading after 2sc
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // ============================= HTML =============================
  return (
    <div className="MainVacations">
      {isLoading ? (
        <LoadScreen />
      ) : (
        <>
          <FilterMenu onDataSend={handleDataReceived} />

          <div className="vacation-cards">
            {vacationsToShow.map((v) => (
              <VacationCard key={v.vacationId} vacation={v} userId={userId} />
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
      )}
    </div>
  );
}

export default MainVacations;
