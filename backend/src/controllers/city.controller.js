import { City } from "../models/city.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllCities = asyncHandler(async (req, res) => {
    const cities = await City.aggregate([
        {
            $sort: {
                City: 1,
                Country: 1,
                Year: -1
            }
        },
        {
            $group: {
                _id: {
                    City: "$City",
                    Country: "$Country"
                },
                doc: {
                    $first: "$$ROOT"
                }
            }
        },
        {
            $replaceRoot: {
                newRoot: "$doc"
            }
        },
        {
            $sort: {
                City: 1,
                Country: 1
            }
        }
    ]);

    const formattedCities = cities.map(city => ({
        label: `${city.City}, ${city.Country}`,
        slug: city.slug
    }));

    if (formattedCities.length === 0) {
        throw new ApiError(404, "No cities found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, formattedCities, "Cities fetched successfully")
        )
})

//helper functions for comparing cities
const calculateWinner = (metrics, cityOneName, cityTwoName) => {
    let cityOneWins = 0;
    let cityTwoWins = 0;

    metrics.forEach((metric) => {
        if (metric.winner === cityOneName) {
            cityOneWins++;
        } else {
            cityTwoWins++;
        }
    });

    return {
        cityOneWins,
        cityTwoWins,
        winner:
            cityOneWins > cityTwoWins
                ? cityOneName
                : cityTwoName
    };
};

const compareLowerIsBetter = (cityOneValue, cityTwoValue, cityOneName, cityTwoName) => ({
    winner:
        cityOneValue < cityTwoValue
            ? cityOneName
            : cityTwoName,

    difference: Number(
        Math.abs(cityOneValue - cityTwoValue).toFixed(2)
    ),
});

const compareHigherIsBetter = (cityOneValue, cityTwoValue, cityOneName, cityTwoName) => ({
    winner:
        cityOneValue > cityTwoValue
            ? cityOneName
            : cityTwoName,

    difference: Number(
        Math.abs(cityOneValue - cityTwoValue).toFixed(2)
    ),
});

const formatCityData = (city) => ({
    city: city.City,
    country: city.Country,
    rent: city.Average_Monthly_Rent_USD,
    food: city.Food_Cost_Index,
    transport: city.Transport_Cost_Index,
    internet: city.Internet_Cost_USD,
    salary: city.Average_Monthly_Salary_USD,
    qualityOfLife: city.Quality_of_Life_Index,
    safety: city.Safety_Index,
    healthcare: city.Healthcare_Index,
    pollution: city.Pollution_Index,
});

const compareCities = asyncHandler(async (req, res) => {
    
    const { city1, city2 } = req.query;

    if (!(city1 && city2)) {
        throw new ApiError(400, "Both cities are required");
    }

    if (city1 === city2) {
        throw new ApiError(400, "Please select two different cities");
    }

    const cityOne = await City.findOne({ slug: city1 });
    const cityTwo = await City.findOne({ slug: city2 });

    if (!cityOne || !cityTwo) {
        throw new ApiError(404, "One or both cities not found");
    }

    const cityOneData = formatCityData(cityOne);
    const cityTwoData = formatCityData(cityTwo);

    const comparison = {
        rent: compareLowerIsBetter(
            cityOneData.rent,
            cityTwoData.rent,
            cityOneData.city,
            cityTwoData.city
        ),

        food: compareLowerIsBetter(
            cityOneData.food,
            cityTwoData.food,
            cityOneData.city,
            cityTwoData.city
        ),

        transport: compareLowerIsBetter(
            cityOneData.transport,
            cityTwoData.transport,
            cityOneData.city,
            cityTwoData.city
        ),

        internet: compareLowerIsBetter(
            cityOneData.internet,
            cityTwoData.internet,
            cityOneData.city,
            cityTwoData.city
        ),

        salary: compareHigherIsBetter(
            cityOneData.salary,
            cityTwoData.salary,
            cityOneData.city,
            cityTwoData.city
        ),

        qualityOfLife: compareHigherIsBetter(
            cityOneData.qualityOfLife,
            cityTwoData.qualityOfLife,
            cityOneData.city,
            cityTwoData.city
        ),

        safety: compareHigherIsBetter(
            cityOneData.safety,
            cityTwoData.safety,
            cityOneData.city,
            cityTwoData.city
        ),

        healthcare: compareHigherIsBetter(
            cityOneData.healthcare,
            cityTwoData.healthcare,
            cityOneData.city,
            cityTwoData.city
        ),

        pollution: compareLowerIsBetter(
            cityOneData.pollution,
            cityTwoData.pollution,
            cityOneData.city,
            cityTwoData.city
        )
    };


    //financial winner is determined by the number of wins in rent, food, transport, internet, and salary
    const financialResult = calculateWinner(
        [
            comparison.rent,
            comparison.food,
            comparison.transport,
            comparison.internet,
            comparison.salary
        ],
        cityOneData.city,
        cityTwoData.city
    );


    //lifestyle winner is determined by the number of wins in quality of life, safety, and healthcare
    const lifestyleResult = calculateWinner(
        [
            comparison.qualityOfLife,
            comparison.safety,
            comparison.healthcare
        ],
        cityOneData.city,
        cityTwoData.city
    );


    //environment winner is determined by the number of wins in pollution
    const environmentResult = calculateWinner(
        [
            comparison.pollution
        ],
        cityOneData.city,
        cityTwoData.city
    );


    //overall winner is determined by the number of wins in all metrics
    const overallResult = calculateWinner(
        Object.values(comparison),
        cityOneData.city,
        cityTwoData.city
    );

    const totalMetrics = overallResult.cityOneWins + overallResult.cityTwoWins;

    const confidence = Math.round(
        (Math.max(overallResult.cityOneWins, overallResult.cityTwoWins) / totalMetrics) * 100
    );


    return res.status(200).json(
        new ApiResponse(200, {
            cityOne: cityOneData,
            cityTwo: cityTwoData,
            comparison,

            financialResult,
            lifestyleResult,
            environmentResult,
            overallResult,

            confidence
        }, "Comparison fetched successfully")
    );
})

export { getAllCities, compareCities };