import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { City } from "../models/city.model.js";

const toCityResponse = (city) => ({
  _id: city._id,
  name: city.City,
  country: city.Country,
  year: city.Year,
  slug: city.slug,
  Country: city.Country,
  City: city.City,
  Year: city.Year,
  Average_Monthly_Rent_USD: city.Average_Monthly_Rent_USD,
  Food_Cost_Index: city.Food_Cost_Index,
  Transport_Cost_Index: city.Transport_Cost_Index,
  Internet_Cost_USD: city.Internet_Cost_USD,
  Average_Monthly_Salary_USD: city.Average_Monthly_Salary_USD,
  Quality_of_Life_Index: city.Quality_of_Life_Index,
  Safety_Index: city.Safety_Index,
  Healthcare_Index: city.Healthcare_Index,
  Pollution_Index: city.Pollution_Index,
  rentMonthly: city.Average_Monthly_Rent_USD,
  foodCostIndex: city.Food_Cost_Index,
  mealCheap: city.Food_Cost_Index,
  transportCostIndex: city.Transport_Cost_Index,
  groceriesMonthly: city.Transport_Cost_Index,
  internetCostUsd: city.Internet_Cost_USD,
  transport: city.Internet_Cost_USD,
  averageMonthlySalary: city.Average_Monthly_Salary_USD,
  qualityOfLife: city.Quality_of_Life_Index,
  safetyIndex: city.Safety_Index,
  healthcareIndex: city.Healthcare_Index,
  pollutionIndex: city.Pollution_Index,
});

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getCitySlugBase = (slug) => slug.toLowerCase().trim().replace(/-\d{4}$/, "");

const findNewestCityBySlug = (slug) =>
  City.find({
    slug: { $regex: new RegExp(`^${escapeRegex(getCitySlugBase(slug))}-\\d{4}$`) },
  })
    .sort({ Year: -1 })
    .limit(1)
    .then(([city]) => city);

// --- Controller 1: GET /api/cities ---
// Returns the newest record for each city with legacy frontend aliases.
const getCityList = asyncHandler(async (req, res) => {
  const cities = await City.aggregate([
    { $sort: { Country: 1, City: 1, Year: -1 } },
    {
      $group: {
        _id: { Country: "$Country", City: "$City" },
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },
    { $sort: { City: 1, Country: 1 } },
  ]);

  if (!cities || cities.length === 0) {
    throw new ApiError(404, "No cities found in the database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cities.map(toCityResponse), "City list fetched successfully"));
});

// --- Controller 2: GET /api/cities/compare?city1=bangalore-india&city2=berlin-germany ---
// Fetches the newest record for both cities in parallel and returns cost differences.
const compareCities = asyncHandler(async (req, res) => {
  const { city1, city2 } = req.query;

  // Guard 1: both slugs must be present
  if (!city1 || !city2) {
    throw new ApiError(400, "Both city1 and city2 query parameters are required");
  }

  const cityOneSlug = getCitySlugBase(city1);
  const cityTwoSlug = getCitySlugBase(city2);

  // Guard 2: slugs must not be the same
  if (cityOneSlug === cityTwoSlug) {
    throw new ApiError(400, "Please select two different cities to compare");
  }

  // Fetch both cities simultaneously (not one after the other)
  const [cityOne, cityTwo] = await Promise.all([
    findNewestCityBySlug(cityOneSlug),
    findNewestCityBySlug(cityTwoSlug),
  ]);

  // Guard 3: both cities must actually exist in the database
  if (!cityOne || !cityTwo) {
    throw new ApiError(404, "One or both cities were not found");
  }

  const cityOneData = toCityResponse(cityOne);
  const cityTwoData = toCityResponse(cityTwo);

  // Calculate cost differences (cityOne minus cityTwo)
  // Positive = cityOne is more expensive
  // Negative = cityOne is cheaper
  const diff = {
    rentMonthly: +(cityOneData.rentMonthly - cityTwoData.rentMonthly).toFixed(2),
    foodCostIndex: +(cityOneData.foodCostIndex - cityTwoData.foodCostIndex).toFixed(2),
    mealCheap: +(cityOneData.mealCheap - cityTwoData.mealCheap).toFixed(2),
    transportCostIndex: +(
      cityOneData.transportCostIndex - cityTwoData.transportCostIndex
    ).toFixed(2),
    groceriesMonthly: +(cityOneData.groceriesMonthly - cityTwoData.groceriesMonthly).toFixed(2),
    internetCostUsd: +(cityOneData.internetCostUsd - cityTwoData.internetCostUsd).toFixed(2),
    transport: +(cityOneData.transport - cityTwoData.transport).toFixed(2),
    Average_Monthly_Salary_USD: +(
      cityOneData.Average_Monthly_Salary_USD - cityTwoData.Average_Monthly_Salary_USD
    ).toFixed(2),
    averageMonthlySalary: +(
      cityOneData.averageMonthlySalary - cityTwoData.averageMonthlySalary
    ).toFixed(2),
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { cityOne: cityOneData, cityTwo: cityTwoData, diff },
        "Comparison fetched successfully"
      )
    );
});

export { getCityList, compareCities };
