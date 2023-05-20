import { createStore } from "redux";
import FollowerModel from "../Models/FollowerModel";

// 1. Followers global State
export class FollowersState {
  public followers: FollowerModel[] = [];
}

// 2. Followers Action Type
export enum FollowersActionType {
  FetchFollowers,
  AddFollower,
  UpdateFollowers,
  DeleteFollower,
}

// 3. Followers Action
export interface FollowersAction {
  type: FollowersActionType;
  payload: any;
}

// 4. Followers Reducer
export function followersReducer(
  currentState = new FollowersState(),
  action: FollowersAction
): FollowersState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    // Fetch
    case FollowersActionType.FetchFollowers: // Payload is all followers for saving
      newState.followers = action.payload;
      break;

    // Add
    case FollowersActionType.AddFollower: // Payload is a follower object for adding
      newState.followers.push(action.payload);
      break;

    // Update
    case FollowersActionType.UpdateFollowers:
      const indexToUpdate = newState.followers.findIndex(
        (f) =>
          f.userId === action.payload.userId &&
          f.vacationId === action.payload.vacationId
      );
      if (indexToUpdate > 0) {
        newState.followers[indexToUpdate] = action.payload;
      }
      break;

    // Delete
    case FollowersActionType.DeleteFollower: // Payload is the user id + vacation id for deleting
      const indexToDelete = newState.followers.findIndex(
        (f) =>
          f.userId === action.payload.userId &&
          f.vacationId === action.payload.vacationId
      );
      if (indexToDelete >= 0) {
        newState.followers.splice(indexToDelete, 1);
      }
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Followers Store - The manager object handling redux:
export const followersStore = createStore(followersReducer);
