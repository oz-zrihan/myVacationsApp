import axios from "axios";
import { UsersActionType, userStore } from "../Redux/UsersState";
import appConfig from "../Utils/AppConfig";
// Models
import UserModel from "../Models/UserModel";

class UsersService {
  // ==================== GET all users ====================
  public async getAllUsers(): Promise<UserModel[]> {
    // Get users from global state:
    let users = userStore.getState().users;

    // If we don't have users
    if (users.length === 0) {
      // Get from server
      const response = await axios.get<UserModel[]>(appConfig.usersUrl);

      // Extract users
      users = response.data;

      // Update global state
      userStore.dispatch({ type: UsersActionType.FetchUsers, payload: users });
    }

    // Return
    return users;
  }

  // ==================== GET one user ====================
  public async getOneUser(userId: number): Promise<UserModel> {
    // Get users from global state:
    let users = userStore.getState().users;

    // Extract specific user
    let user = users.find((u) => u.userId === userId);

    // If user don't exist
    if (!user) {
      // Get from server
      const response = await axios.get<UserModel>(appConfig.usersUrl + userId);

      // Extract user
      user = response.data;
    }

    // Return
    return user;
  }

  // ==================== ADD one user ====================
  public async addUser(user: UserModel): Promise<void> {
    // Send axios request to server
    const response = await axios.post<UserModel>(appConfig.vacationsUrl, user);

    // Get added user
    const addedUser = response.data;

    // Add user to global state
    userStore.dispatch({ type: UsersActionType.AddUser, payload: addedUser });
  }

  // ==================== EDIT user ====================
  public async editUser(user: UserModel): Promise<void> {
    // Send user to server
    const response = await axios.put<UserModel>(
      appConfig.usersUrl + user.userId,
      user
    );

    // Get updated user
    const updatedUser = response.data;

    // Update global state
    userStore.dispatch({
      type: UsersActionType.UpdateUser,
      payload: updatedUser,
    });
  }

  // ==================== DELETE vacation ====================
  public async deleteUser(userId: number): Promise<void> {
    // Delete user from server
    await axios.delete(appConfig.usersUrl + userId);

    // Delete from global state
    userStore.dispatch({ type: UsersActionType.DeleteUser, payload: userId });
  }
}

const usersService = new UsersService();

export default usersService;
