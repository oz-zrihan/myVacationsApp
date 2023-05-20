import { OkPacket } from "mysql";
// Model
import CountryModel from "../2-models/country-model";
// Utils
import dal from "../4-utils/dal";

// ====================== Get all countries ======================
async function getAllCountries(): Promise<CountryModel[]> {
  // Query
  const sql = `SELECT * FROM countries`;

  // Execute:
  const countries = await dal.execute(sql);

  return countries;
}

// ====================== insert airline ======================
async function insertCountry(country: CountryModel): Promise<CountryModel> {
  // Delete countryId
  delete country.countryId;

  // Joi validation
  country.validatePost();

  // Query
  const sql = `INSERT INTO countries VALUES(DEFAULT, ?)`;

  // Execute:
  const result: OkPacket = await dal.execute(sql, [country.countryName]);

  // Insert to airline given Id
  country.countryId = result.insertId;

  return country;
}

export default {
  getAllCountries,
  insertCountry,
};
