import "./AdminFollowers.scss";
import { useEffect, useState } from "react";
import { followersStore } from "../../../../Redux/FollowersState";
// Models
import FollowerModel from "../../../../Models/FollowerModel";
// Services
import followersService from "../../../../Services/FollowersService";

interface followerProps {
  vacationId: number;
  userId: number;
}

function AdminFollowers(props: followerProps): JSX.Element {
  // Set follower from props
  const follower = new FollowerModel(props);

  // Follower State
  const [followers, setFollowers] = useState<FollowerModel[]>([]);

  // Get follower by vacation
  useEffect(() => {
    followersService
      .getFollowersByVacation(follower.vacationId)
      .then((dbFollowers) => setFollowers(dbFollowers));

    const unsubscribe = followersStore.subscribe(() => {
      const updatedFollowers = followersStore.getState().followers;
      const followersByVacation = updatedFollowers.filter(
        (f) => f.vacationId === follower.vacationId
      );
      setFollowers(followersByVacation);
    });
    return () => unsubscribe();
  }, []);

  // ============================= HTML =============================
  return (
    <div className="AdminFollowers">
      <>
        <div className="followers-wrapper">
          <span> Number of followers: </span>
          <span>{followers.length}</span>
        </div>
      </>
    </div>
  );
}

export default AdminFollowers;
