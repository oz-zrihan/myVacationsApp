import axios from "axios";
import appConfig from "../Utils/AppConfig";
import { LuggageActionType, luggageStore } from "../Redux/LuggageState";
//Models
import LuggageModel from "../Models/LuggageModel";

class LuggageService {
  // ==================== GET all luggage ====================
  public async getAllLuggage(): Promise<LuggageModel[]> {
    // Get luggage from global state:
    let luggage = luggageStore.getState().luggage;

    // If we don't have luggage
    if (luggage.length === 0) {
      // Get from server
      const response = await axios.get<LuggageModel[]>(appConfig.luggageUrl);

      // Extract luggage
      luggage = response.data;

      // Update global state
      luggageStore.dispatch({
        type: LuggageActionType.FetchLuggage,
        payload: luggage,
      });
    }

    // Return
    return luggage;
  }

  // ==================== ADD one luggage ====================
  public async addLuggage(luggageName: string): Promise<void> {
    // Send axios request to server
    const response = await axios.post<LuggageModel>(appConfig.luggageUrl, {
      luggageName: luggageName,
    });

    // Get added luggage
    const addedLuggage = response.data;

    // Add luggage to global state
    luggageStore.dispatch({
      type: LuggageActionType.AddLuggage,
      payload: addedLuggage,
    });
  }
}

const luggageService = new LuggageService();

export default luggageService;
