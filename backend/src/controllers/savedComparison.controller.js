import { SavedComparison } from "../models/savedComparison.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { City } from "../models/city.model.js";
import mongoose from "mongoose";

const saveComparison = asyncHandler(async (req, res) => {

    const { cityOneSlug, cityTwoSlug } = req.body;

    if (!cityOneSlug || !cityTwoSlug) {
        throw new ApiError(400, "Both city slugs are required");
    }

    if (cityOneSlug === cityTwoSlug) {
        throw new ApiError(400, "Please select two different cities");
    }

    const existingComparison = await SavedComparison.findOne({
        userId: req.user._id,
        cityOneSlug,
        cityTwoSlug
    });

    if (existingComparison) {
        throw new ApiError(400, "Comparison already exists");
    }

    // Find both cities using their slugs
    const cityOne = await City.findOne({
        slug: cityOneSlug
    });

    const cityTwo = await City.findOne({
        slug: cityTwoSlug
    });

    // Save comparison with both slug and display name
    const comparison = await SavedComparison.create({
        userId: req.user._id,

        cityOneSlug,
        cityTwoSlug,

        cityOneName: `${cityOne.City}, ${cityOne.Country}`,
        cityTwoName: `${cityTwo.City}, ${cityTwo.Country}`
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            comparison,
            "Comparison saved successfully"
        )
    );
});

const toggleSavedComparison = asyncHandler(async (req, res) => {

    const { cityOneSlug, cityTwoSlug } = req.body;

    if (!cityOneSlug || !cityTwoSlug) {
        throw new ApiError(400, "Both city slugs are required");
    }

    const existingComparison = await SavedComparison.findOne({
        userId: req.user._id,
        cityOneSlug,
        cityTwoSlug
    });

    if (existingComparison) {

        await SavedComparison.findByIdAndDelete(
            existingComparison._id
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    saved: false
                },
                "Comparison removed successfully"
            )
        );
    }

    const cityOne = await City.findOne({
        slug: cityOneSlug
    });

    const cityTwo = await City.findOne({
        slug: cityTwoSlug
    });

    const comparison = await SavedComparison.create({
        userId: req.user._id,

        cityOneSlug,
        cityTwoSlug,

        cityOneName: `${cityOne.City}, ${cityOne.Country}`,
        cityTwoName: `${cityTwo.City}, ${cityTwo.Country}`
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                saved: true,
                comparison
            },
            "Comparison saved successfully"
        )
    );
});

const getSavedComparisons = asyncHandler(async (req, res) => {

    const comparisons = await SavedComparison.find({ userId: req.user._id })
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new ApiResponse(
            200,
            comparisons,
            "Comparisons fetched successfully"
        )
    );
});

const deleteSavedComparison = asyncHandler(async (req, res) => {

    const { comparisonId } = req.params;

    if (!mongoose.isValidObjectId(comparisonId)) {
        throw new ApiError(400, "Invalid comparison ID");
    }

    const comparison = await SavedComparison.findOneAndDelete({
        _id: comparisonId,
        userId: req.user._id
    });

    if (!comparison) {
        throw new ApiError(404, "Comparison not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Comparison deleted successfully"
        )
    );
});

export {
    saveComparison,
    toggleSavedComparison,
    getSavedComparisons,
    deleteSavedComparison
};
