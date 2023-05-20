import { createStore } from "redux";
import LuggageModel from "../Models/LuggageModel";

// 1. Airlines global State
export class LuggageState {
  public luggage: LuggageModel[] = [];
}

// 2. Airlines Action Type
export enum LuggageActionType {
  FetchLuggage,
  AddLuggage,
}

// 3. Airlines Action
export interface LuggageAction {
  type: LuggageActionType;
  payload: any;
}

// 4. Airlines Reducer
export function luggageReducer(
  currentState = new LuggageState(),
  action: LuggageAction
): LuggageState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case LuggageActionType.FetchLuggage: // Payload is all luggage for saving
      newState.luggage = action.payload;
      break;

    case LuggageActionType.AddLuggage: // Payload is a luggage object for adding
      newState.luggage.push(action.payload);
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Luggage Store - The manager object handling redux:
export const luggageStore = createStore(luggageReducer);
