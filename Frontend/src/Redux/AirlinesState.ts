import { createStore } from "redux";
import AirlineModel from "../Models/AirlineModel";

// 1. Airlines global State
export class AirlinesState {
  public airlines: AirlineModel[] = [];
}

// 2. Airlines Action Type
export enum AirlinesActionType {
  FetchAirlines,
  AddAirline,
}

// 3. Airlines Action
export interface AirlinesAction {
  type: AirlinesActionType;
  payload: any;
}

// 4. Airlines Reducer
export function airlinesReducer(
  currentState = new AirlinesState(),
  action: AirlinesAction
): AirlinesState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case AirlinesActionType.FetchAirlines: // Payload is all airlines for saving
      newState.airlines = action.payload;
      break;

    case AirlinesActionType.AddAirline: // Payload is a airline object for adding
      newState.airlines.push(action.payload);
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Airlines Store - The manager object handling redux:
export const airlinesStore = createStore(airlinesReducer);
