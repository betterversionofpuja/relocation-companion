import csvParser from "csv-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { City } from "../src/models/city.model.js";
import connectDB from "../src/db/index.js";

// Resolve absolute path to the CSV dataset
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.resolve(__dirname, "data", "cities.csv");

// Load environment variables from project root
dotenv.config({
  path: path.resolve(__dirname, "..", ".env")
});

const seedDatabase = async () => {
  // Establish MongoDB connection
  await connectDB();

  // Store parsed city records before bulk insertion
  const cityDocs = [];

  fs.createReadStream(csvPath)
    .pipe(csvParser())

    // Convert each CSV row into a City document
    .on("data", (row) => {
      cityDocs.push({
        Country: row.Country,
        City: row.City,
        Year: Number(row.Year),

        Average_Monthly_Rent_USD: Number(row.Average_Monthly_Rent_USD),
        Food_Cost_Index: Number(row.Food_Cost_Index),
        Transport_Cost_Index: Number(row.Transport_Cost_Index),
        Internet_Cost_USD: Number(row.Internet_Cost_USD),
        Average_Monthly_Salary_USD: Number(row.Average_Monthly_Salary_USD),

        Quality_of_Life_Index: Number(row.Quality_of_Life_Index),
        Safety_Index: Number(row.Safety_Index),
        Healthcare_Index: Number(row.Healthcare_Index),
        Pollution_Index: Number(row.Pollution_Index),
      });
    })

    // Bulk insert all records once CSV processing is complete
    .on("end", async () => {
      console.log(`Found ${cityDocs.length} cities`);

      await City.insertMany(cityDocs);

      console.log("Cities inserted successfully");

      // Close database connection and exit
      await mongoose.disconnect();
    })

    // Handle file parsing or stream errors
    .on("error", (error) => {
      console.error(error);
    });
};

seedDatabase();