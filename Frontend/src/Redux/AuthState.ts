import { createStore } from "redux";
import UserModel from "../Models/UserModel";
import jwtDecode from "jwt-decode";

// 1. Auth global State
export class AuthState {
  public token: string = null;
  public user: UserModel = null;

  public constructor() {
    this.token = localStorage.getItem("token");
    if (this.token) {
      this.user = jwtDecode<{ user: UserModel }>(this.token).user;
    }
  }
}

// 2. Auth Action Type
export enum AuthActionType {
  Register,
  Login,
  Logout,
}

// 3. Auth Action
export interface AuthAction {
  type: AuthActionType;
  payload?: string;
}

// 4. Auth Reducer
export function authReducer(
  currentState = new AuthState(),
  action: AuthAction
): AuthState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case AuthActionType.Register: // Payload is token
    case AuthActionType.Login: // Payload is token
      newState.token = action.payload;
      newState.user = jwtDecode<{ user: UserModel }>(action.payload).user;
      localStorage.setItem("token", newState.token);
      break;

    case AuthActionType.Logout: // No payload
      newState.token = null;
      newState.user = null;
      localStorage.removeItem("token");
      break;
  }
  // Return the newState:
  return newState;
}

// 5. Auth Store - The manager object handling redux:
export const authStore = createStore(authReducer);
