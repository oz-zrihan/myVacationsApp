import { createStore } from "redux";
import CountryModel from "../Models/CountryModel";

// 1. Countries global State
export class CountriesState {
  public countries: CountryModel[] = [];
}

// 2. Countries Action Type
export enum CountriesActionType {
  FetchCountries,
  AddCountry,
}

// 3. Countries Action
export interface CountriesAction {
  type: CountriesActionType;
  payload: any;
}

// 4. Countries Reducer
export function countriesReducer(
  currentState = new CountriesState(),
  action: CountriesAction
): CountriesState {
  // Duplicate current state into a new state:
  const newState = { ...currentState };

  // Perform action on the newState:
  switch (action.type) {
    case CountriesActionType.FetchCountries: // Payload is all countries for saving
      newState.countries = action.payload;
      break;

    case CountriesActionType.AddCountry: // Payload is a country object for adding
      newState.countries.push(action.payload);
      break;
  }

  // Return the newState:
  return newState;
}

// 5. Countries Store - The manager object handling redux:
export const countriesStore = createStore(countriesReducer);
