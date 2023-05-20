import { createStore } from "redux";
import BoardModel from "../Models/BoardModel";

// 1. Boards global State
export class BoardsState {
  public boards: BoardModel[] = [];
}

// 2. Boards Action Type
export enum BoardsActionType {
  FetchBoards,
  AddBoard,
}

// 3. Boards Action
export interface BoardsAction {
  type: BoardsActionType;
  payload: any;
}

// 4. Boards Reducer
export function boardsReducer(
  currentState = new BoardsState(),
  action: BoardsAction
): BoardsState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case BoardsActionType.FetchBoards: // Payload is all boards for saving
      newState.boards = action.payload;
      break;

    case BoardsActionType.AddBoard: // Payload is a board object for adding
      newState.boards.push(action.payload);
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Boards Store - The manager object handling redux:
export const boardsStore = createStore(boardsReducer);
