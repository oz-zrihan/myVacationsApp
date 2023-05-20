import "./FollowedVacation.scss";
import { useEffect, useState } from "react";
// Models
import VacationModel from "../../../../Models/VacationModel";
import FollowerModel from "../../../../Models/FollowerModel";
import UserModel from "../../../../Models/UserModel";
// Services
import vacationsService from "../../../../Services/vacationsService";
import notifyService from "../../../../Services/NotifyService";
import followersService from "../../../../Services/FollowersService";
import { followersStore } from "../../../../Redux/FollowersState";
// Component
import VacationCard from "../../VacationsArea/VacationCard/VacationCard";

interface UserProps {
  user: UserModel;
}

function FollowedVacation(props: UserProps): JSX.Element {
  // Vacations state
  const [vacations, setVacations] = useState<VacationModel[]>([]);

  // Followers state
  const [followers, setFollowers] = useState<FollowerModel[]>([]);

  // Get all Vacations and Followers
  useEffect(() => {
    vacationsService
      .getAllVacations()
      .then((dbVacations) => {
        setVacations(dbVacations);
        return followersService.getAllFollowers();
      })
      .then((dbFollowers) => setFollowers(dbFollowers))
      .catch((err) => notifyService.error(err));

    // Subscribe for changes -> rerender when user unfollow a vacation
    const unsubscribe = followersStore.subscribe(() => {
      const updatedFollowers = followersStore.getState().followers;
      const updatedFollowedVacations = updatedFollowers.filter(
        (f) => f.userId === props.user.userId
      );
      setFollowers(updatedFollowedVacations);
    });
    return () => unsubscribe();
  }, []);

  // Filter only followed vacations
  useEffect(() => {
    const followedVacations = followers.filter(
      (f) => f.userId === props.user.userId
    );
    const followedVacationIds = followedVacations.map((f) => f.vacationId);
    const filteredVacations = vacations.filter((v) =>
      followedVacationIds.includes(v.vacationId)
    );
    setVacations(filteredVacations);
  }, [followers, props.user]);

  // ============================= HTML =============================
  return (
    <div className="FollowedVacation">
      <h2> My followed vacations</h2>
      <div className="vacation-cards">
        {vacations.map((v) => (
          <VacationCard
            key={v.vacationId}
            vacation={v}
            userId={props.user.userId}
          />
        ))}
      </div>
    </div>
  );
}

export default FollowedVacation;
