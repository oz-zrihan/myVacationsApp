import { createStore } from "redux";
import UserModel from "../Models/UserModel";

// 1. Users global State
export class UsersState {
  public users: UserModel[] = [];
}

// 2. Users Action Type
export enum UsersActionType {
  FetchUsers,
  AddUser,
  UpdateUser,
  DeleteUser,
}

// 3. Users Action
export interface UsersAction {
  type: UsersActionType;
  payload: any;
}

// 4. Users Reducer
export function usersReducer(
  currentState = new UsersState(),
  action: UsersAction
): UsersState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case UsersActionType.FetchUsers: // Payload is all users for saving
      newState.users = action.payload;
      break;

    case UsersActionType.AddUser: // Payload is a user object for adding
      newState.users.push(action.payload);
      break;

    case UsersActionType.UpdateUser: // Payload is a user object for updating
      const indexToUpdate = newState.users.findIndex(
        (u) => u.userId === action.payload.userId
      );
      if (indexToUpdate >= 0) {
        newState.users[indexToUpdate] = action.payload;
      }
      break;

    case UsersActionType.DeleteUser: // Payload is the User id for deleting
      const indexToDelete = newState.users.findIndex(
        (u) => u.userId === action.payload
      );
      if (indexToDelete >= 0) {
        newState.users.splice(indexToDelete, 1);
      }
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Products Store - The manager object handling redux:
export const userStore = createStore(usersReducer);
