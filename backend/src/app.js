import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://relocation-companion-pro.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Relocation Companion API is running"
  });
});

// routes import
import userRouter from "./routes/user.routes.js";
import citiesRouter from "./routes/cities.routes.js";
import savedComparisonRouter from "./routes/savedComparison.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cities", citiesRouter);
app.use("/api/v1/saved-comparisons", savedComparisonRouter);



export default app;