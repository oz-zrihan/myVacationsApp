import axios from "axios";
import { AirlinesActionType, airlinesStore } from "../Redux/AirlinesState";
import appConfig from "../Utils/AppConfig";
// Models
import AirlineModel from "../Models/AirlineModel";

class AirlinesService {
  // ==================== GET all airlines ====================
  public async getAllAirlines(): Promise<AirlineModel[]> {
    // Get airlines from global state:
    let airlines = airlinesStore.getState().airlines;

    // If we don't have airlines
    if (airlines.length === 0) {
      // Get from server
      const response = await axios.get<AirlineModel[]>(appConfig.airlinesUrl);

      // Extract airlines
      airlines = response.data;

      // Update global state
      airlinesStore.dispatch({
        type: AirlinesActionType.FetchAirlines,
        payload: airlines,
      });
    }

    // Return
    return airlines;
  }

  // ==================== ADD one airline ====================
  public async addAirline(airlineName: string): Promise<void> {
    // Send axios request to server
    const response = await axios.post<AirlineModel>(appConfig.airlinesUrl, {
      airlineName: airlineName,
    });

    // Get added airline
    const addedAirline = response.data;

    // Add airline to global state
    airlinesStore.dispatch({
      type: AirlinesActionType.AddAirline,
      payload: addedAirline,
    });
  }
}

const airlinesService = new AirlinesService();

export default airlinesService;
