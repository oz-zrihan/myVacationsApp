import axios from "axios";
import { VacationsActionType, vacationStore } from "../Redux/VacatiosState";
import appConfig from "../Utils/AppConfig";
//Models
import VacationModel from "../Models/VacationModel";

class VacationService {
  //  ==================== GET all vacations ====================
  public async getAllVacations(): Promise<VacationModel[]> {
    // Get vacations from global state:
    let vacations = vacationStore.getState().vacations;

    // If we don't have vacations
    if (vacations.length === 0) {
      // Get from server
      const response = await axios.get<VacationModel[]>(appConfig.vacationsUrl);

      // Extract vacation
      vacations = response.data;

      // Update global state
      vacationStore.dispatch({
        type: VacationsActionType.FetchVacations,
        payload: vacations,
      });
    }

    // Return
    return vacations;
  }

  // ==================== GET one vacations ====================
  public async getOneVacation(vacationId: number): Promise<VacationModel> {
    // Get vacations from global state:
    let vacations = vacationStore.getState().vacations;

    // Extract specific vacation
    let vacation = vacations.find((v) => v.vacationId === vacationId);

    // If vacation don't exist
    if (!vacation) {
      // Get from server
      const response = await axios.get<VacationModel>(
        appConfig.vacationsUrl + vacationId
      );

      // Extract vacation
      vacation = response.data;
    }

    // Return
    return vacation;
  }

  // ==================== ADD one vacation ====================
  public async addVacation(vacation: VacationModel): Promise<void> {
    // Send axios request to server
    const response = await axios.post<VacationModel>(
      appConfig.vacationsUrl,
      vacation
    );

    // Get added vacation
    const addedVacation = response.data;

    // Add vacation to global state
    vacationStore.dispatch({
      type: VacationsActionType.AddVacation,
      payload: addedVacation,
    });
  }

  // ==================== EDIT vacation ====================
  public async editVacation(vacation: VacationModel): Promise<void> {
    // Send vacation to server
    const response = await axios.put<VacationModel>(
      appConfig.vacationsUrl + vacation.vacationId,
      vacation
    );

    // Get updated vacation
    const updatedVacation = response.data;

    // Update global state
    vacationStore.dispatch({
      type: VacationsActionType.UpdateVacation,
      payload: updatedVacation,
    });
  }
  // ==================== DELETE vacation ====================
  public async deleteVacation(vacationId: number): Promise<void> {
    // Delete vacation from server
    await axios.delete(appConfig.vacationsUrl + vacationId);

    // Delete from global state
    vacationStore.dispatch({
      type: VacationsActionType.DeleteVacation,
      payload: vacationId,
    });
  }
}

const vacationsService = new VacationService();

export default vacationsService;
