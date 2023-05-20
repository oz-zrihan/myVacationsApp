import "./Followers.scss";
import { useEffect, useState } from "react";
// Models
import FollowerModel from "../../../../Models/FollowerModel";
// Services
import followersService from "../../../../Services/FollowersService";
// Icons
import { FcLike } from "react-icons/fc";
import { followersStore } from "../../../../Redux/FollowersState";

interface followerProps {
  vacationId: number;
  userId: number;
}

function Followers(props: followerProps): JSX.Element {
  // Set follower from props
  const follower = new FollowerModel(props);

  // Follower State
  const [followers, setFollowers] = useState<FollowerModel[]>([]);

  // loading state -> show spinner if true
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Check if following
  function isFollowing(follower: FollowerModel): boolean {
    const isFollowing = followers.filter(
      (f) =>
        f.userId === follower.userId && f.vacationId === follower.vacationId
    );
    return isFollowing.length > 0;
  }

  // Handle follow button
  async function handleFollow(): Promise<void> {
    setIsLoading(true);
    if (isFollowing(follower)) {
      await followersService.deleteFollower(follower);
    } else {
      await followersService.addFollower(follower);
    }
    // setIsLoading(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }

  // ============================= HTML =============================
  return (
    <div className="Followers" onClick={() => handleFollow()}>
      <>
        <button
          className={isFollowing(follower) ? "" : "not-like"}
          disabled={isLoading}
        >
          <FcLike />
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <span>{followers.length}</span>
          )}
        </button>
      </>
    </div>
  );
}

export default Followers;
