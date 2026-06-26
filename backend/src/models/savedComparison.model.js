import mongoose, { Schema } from "mongoose";

const savedComparisonSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    cityOneSlug: {
        type: String,
        required: true
    },

    cityTwoSlug: {
        type: String,
        required: true
    },

    cityOneName: {
        type: String,
        required: true
    },

    cityTwoName: {
        type: String,
        required: true
    },
    
}, {
    timestamps: true,
    versionKey: false
});

savedComparisonSchema.index( //so that no duplicate comparisons are saved for the same user
    {
        userId: 1,
        cityOneSlug: 1,
        cityTwoSlug: 1,
    },
    {
        unique: true,
    }
);

export const SavedComparison = mongoose.model("SavedComparison", savedComparisonSchema);