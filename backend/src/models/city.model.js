import mongoose from "mongoose";

// Rules for generating a unique slug for each city based on its name, country, and year
const createCitySlug = (city, country, year) =>
  `${city}-${country}-${year}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const citySchema = new mongoose.Schema(
  {
    // City metadata
    Country: {
      type: String,
      required: true,
      trim: true,
    },
    City: {
      type: String,
      required: true,
      trim: true,
    },
    Year: {
      type: Number,
      required: true,
    },

    // Cost of living metrics
    Average_Monthly_Rent_USD: {
      type: Number,
      default: 0,
    },
    Food_Cost_Index: {
      type: Number,
      default: 0,
    },
    Transport_Cost_Index: {
      type: Number,
      default: 0,
    },
    Internet_Cost_USD: {
      type: Number,
      default: 0,
    },
    Average_Monthly_Salary_USD: {
      type: Number,
      default: 0,
    },

    // Quality of life metrics
    Quality_of_Life_Index: {
      type: Number,
      default: 0,
    },
    Safety_Index: {
      type: Number,
      default: 0,
    },
    Healthcare_Index: {
      type: Number,
      default: 0,
    },
    Pollution_Index: {
      type: Number,
      default: 0,
    },

    // Unique identifier used for lookups and routing
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Auto-generate slug before document validation using rules defined in createCitySlug function
citySchema.pre("validate", function setYearScopedSlug() {
  if (this.City && this.Country && this.Year) {
    this.slug = createCitySlug(
      String(this.City),
      String(this.Country),
      String(this.Year)
    );
  }
});

export const City = mongoose.model("City", citySchema);