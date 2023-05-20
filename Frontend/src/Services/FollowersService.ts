import axios from "axios";
import { FollowersActionType, followersStore } from "../Redux/FollowersState";
import appConfig from "../Utils/AppConfig";
// Models
import FollowerModel from "../Models/FollowerModel";

class FollowersService {
  // ==================== GET all followers ====================
  public async getAllFollowers(): Promise<FollowerModel[]> {
    // Get followers from global state:
    let followers = followersStore.getState().followers;

    // If we don't have followers
    if (followers.length === 0) {
      // Get from server
      const response = await axios.get<FollowerModel[]>(appConfig.followersUrl);

      // Extract followers
      followers = response.data;

      // Update global state
      followersStore.dispatch({
        type: FollowersActionType.FetchFollowers,
        payload: followers,
      });
    }

    // Return
    return followers;
  }

  // ==================== GET one follower ====================
  public async getOneFollower(userId: number): Promise<FollowerModel[]> {
    // Get followers from global state:
    let followers = followersStore.getState().followers;

    // Extract specific follower
    let follower = followers.filter((f) => f.userId === userId);

    // If follower don't exist
    if (follower.length === 0) {
      // Get from server
      const response = await axios.get<FollowerModel[]>(
        appConfig.followersUrl + "by-user/" + userId
      );

      // Extract follower
      follower = response.data;
    }

    // Return
    return follower;
  }

  // ==================== GET followers by vacation ====================
  public async getFollowersByVacation(
    vacationId: number
  ): Promise<FollowerModel[]> {
    // Get followers from global state:
    let followers = followersStore.getState().followers;

    // Extract specific follower
    let followerByVacation = followers.filter(
      (f) => f.vacationId === vacationId
    );

    // If followers don't exist
    if (followerByVacation.length === 0) {
      // Get from server
      const response = await axios.get<FollowerModel[]>(
        appConfig.followersUrl + "by-vacation/" + vacationId
      );

      // Extract followers
      followerByVacation = response.data;
    }

    // Return
    return followerByVacation;
  }

  // ==================== ADD one follower ====================
  public async addFollower(follower: FollowerModel): Promise<void> {
    // Send axios request to server
    const response = await axios.post<FollowerModel>(
      appConfig.followersUrl,
      follower
    );

    // Get added follower
    const addedFollower = response.data;

    // Add follower to global state
    followersStore.dispatch({
      type: FollowersActionType.AddFollower,
      payload: addedFollower,
    });
  }

  // ==================== DELETE vacation ====================
  public async deleteFollower(follower: FollowerModel): Promise<void> {
    const vacationId = +follower.vacationId;
    const userId = +follower.userId;

    // Delete follower from server
    await axios.delete(appConfig.followersUrl + "delete", {
      params: { vacationId, userId },
    });

    // Delete from global state
    followersStore.dispatch({
      type: FollowersActionType.DeleteFollower,
      payload: follower,
    });
  }
}

const followersService = new FollowersService();

export default followersService;
