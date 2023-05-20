import express, { Request, Response, NextFunction } from "express";
// Model
import CountryModel from "../2-models/country-model";
// Service
import countriesService from "../5-services/countries-service";

const router = express.Router();

// GET http://localhost:4000/api/countries
router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const countries = await countriesService.getAllCountries();
        response.json(countries);
    }
    catch(err: any) {
        next(err);
    }
});

// POST http://localhost:4000/api/countries/
router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const country = new CountryModel(request.body.countryId, request.body.countryName);        
        const addedCountry = await countriesService.insertCountry(country);
        response.status(201).json(addedCountry);
    }
    catch(err: any) {
        next(err);
    }
});


export default router;
