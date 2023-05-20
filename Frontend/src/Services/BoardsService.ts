import axios from "axios";
import appConfig from "../Utils/AppConfig";
import { BoardsActionType, boardsStore } from "../Redux/BoardsState";
// Models
import BoardModel from "../Models/BoardModel";

class BoardsService {
  // ==================== GET all boards ====================
  public async getAllBoards(): Promise<BoardModel[]> {
    // Get boards from global state:
    let boards = boardsStore.getState().boards;

    // If we don't have airlines
    if (boards.length === 0) {
      // Get from server
      const response = await axios.get<BoardModel[]>(appConfig.boardsUrl);

      // Extract boards
      boards = response.data;

      // Update global state
      boardsStore.dispatch({
        type: BoardsActionType.FetchBoards,
        payload: boards,
      });
    }

    // Return
    return boards;
  }

  // ==================== ADD one board ====================
  public async addBoard(boardName: string): Promise<void> {
    // Send axios request to server
    const response = await axios.post<BoardModel>(appConfig.boardsUrl, {
      boardName: boardName,
    });

    // Get added board
    const addedBoard = response.data;

    // Add board to global state
    boardsStore.dispatch({
      type: BoardsActionType.AddBoard,
      payload: addedBoard,
    });
  }
}

const boardsService = new BoardsService();

export default boardsService;
