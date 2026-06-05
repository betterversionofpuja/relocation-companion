import mongoose from "mongoose";

const createCitySlug = (city, country, year) =>
  `${city}-${country}-${year}`
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const citySchema = new mongoose.Schema(
  {
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
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
  }
);

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
