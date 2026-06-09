import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import cityRouter from "./routes/city.routes.js";
import savedComparisonRouter from "./routes/savedComparison.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://relocation-companion-rouge.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error("CORS block: Origin not allowed."), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend + DB working");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/cities", cityRouter);
app.use("/api/v1/saved-comparisons", savedComparisonRouter);
app.use("/api/saved-comparisons", savedComparisonRouter);
app.use(errorHandler);

export { app };
