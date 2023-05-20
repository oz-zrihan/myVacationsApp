import axios from "axios";
import { CountriesActionType, countriesStore } from "../Redux/CountriesState";
import appConfig from "../Utils/AppConfig";
// Models
import CountryModel from "../Models/CountryModel";

class CountriesService {
  // ==================== GET all countries ====================
  public async getAllCountries(): Promise<CountryModel[]> {
    // Get countries from global state:
    let countries = countriesStore.getState().countries;

    // If we don't have countries
    if (countries.length === 0) {
      // Get from server
      const response = await axios.get<CountryModel[]>(appConfig.countriesUrl);

      // Extract countries
      countries = response.data;

      // Update global state
      countriesStore.dispatch({
        type: CountriesActionType.FetchCountries,
        payload: countries,
      });
    }

    // Return
    return countries;
  }

  // ==================== ADD one country ====================
  public async addCountry(countryName: string): Promise<void> {
    console.log(countryName);

    // Send axios request to server
    const response = await axios.post<CountryModel>(appConfig.countriesUrl, {
      countryName: countryName,
    });

    // Get added user
    const addedCountry = response.data;

    // Add country to global state
    countriesStore.dispatch({
      type: CountriesActionType.AddCountry,
      payload: addedCountry,
    });
  }
}

const countriesService = new CountriesService();

export default countriesService;
