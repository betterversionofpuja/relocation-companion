import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csvParser from "csv-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { City } from "../src/models/city.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.resolve(__dirname, "data", "cities.csv");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const CSV_HEADERS = [
  "Country",
  "City",
  "Year",
  "Average_Monthly_Rent_USD",
  "Food_Cost_Index",
  "Transport_Cost_Index",
  "Internet_Cost_USD",
  "Average_Monthly_Salary_USD",
  "Quality_of_Life_Index",
  "Safety_Index",
  "Healthcare_Index",
  "Pollution_Index",
];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const cleanHeader = (header) => header.trim().replace(/^["']|["']$/g, "");

const createSlug = (row) =>
  `${row["City"].toLowerCase()}-${row["Country"].toLowerCase()}-${row["Year"]}`
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const parseCityRow = (row) => ({
  Country: row["Country"]?.trim(),
  City: row["City"]?.trim(),
  Year: toNumber(row["Year"]),
  Average_Monthly_Rent_USD: toNumber(row["Average_Monthly_Rent_USD"]),
  Food_Cost_Index: toNumber(row["Food_Cost_Index"]),
  Transport_Cost_Index: toNumber(row["Transport_Cost_Index"]),
  Internet_Cost_USD: toNumber(row["Internet_Cost_USD"]),
  Average_Monthly_Salary_USD: toNumber(row["Average_Monthly_Salary_USD"]),
  Quality_of_Life_Index: toNumber(row["Quality_of_Life_Index"]),
  Safety_Index: toNumber(row["Safety_Index"]),
  Healthcare_Index: toNumber(row["Healthcare_Index"]),
  Pollution_Index: toNumber(row["Pollution_Index"]),
  slug: createSlug(row),
});

const loadCitiesFromCSV = () =>
  new Promise((resolve, reject) => {
    const cityDocs = [];

    fs.createReadStream(csvPath)
      .pipe(csvParser({ mapHeaders: ({ header }) => cleanHeader(header) }))
      .on("headers", (headers) => {
        const missingHeaders = CSV_HEADERS.filter((header) => !headers.includes(header));
        const extraHeaders = headers.filter((header) => !CSV_HEADERS.includes(header));

        if (missingHeaders.length > 0 || extraHeaders.length > 0) {
          reject(
            new Error(
              `CSV headers do not match the expected 12-column Kaggle format. Missing: ${
                missingHeaders.join(", ") || "none"
              }. Extra: ${extraHeaders.join(", ") || "none"}.`
            )
          );
        }
      })
      .on("data", (row) => {
        const cityName = row["City"] || row["city"];
        const countryName = row["Country"] || row["country"];
        if (!cityName || !countryName) return;

        row["City"] = cityName;
        row["Country"] = countryName;
        cityDocs.push(parseCityRow(row));
      })
      .on("end", () => resolve(cityDocs))
      .on("error", (err) => reject(err));
  });

const getInsertedCountFromError = (error) =>
  error?.result?.insertedCount ??
  error?.result?.nInserted ??
  error?.insertedDocs?.length ??
  0;

const seed = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the environment");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    await City.deleteMany({});
    console.log("Old city documents deleted.");

    const cityDocs = await loadCitiesFromCSV();
    console.log(`CSV read complete. ${cityDocs.length} rows found.`);

    try {
      const insertedDocs = await City.insertMany(cityDocs, {
        ordered: false,
        throwOnValidationError: true,
      });
      console.log(
        `Seed complete. Rows read: ${cityDocs.length}. Inserted: ${insertedDocs.length}. Duplicates skipped: 0.`
      );
    } catch (error) {
      if (error.code === 11000 || error.name === "MongoBulkWriteError") {
        const insertedCount = getInsertedCountFromError(error);
        const duplicateCount = cityDocs.length - insertedCount;

        console.warn(
          `Seed complete with duplicate slugs skipped. Rows read: ${cityDocs.length}. Inserted: ${insertedCount}. Duplicates skipped: ${duplicateCount}.`
        );
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected. Seeder done.");
  }
};

seed();
