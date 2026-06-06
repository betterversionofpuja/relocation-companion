import dotenv from "dotenv"
dotenv.config({ path: './.env' })

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/user.routes.js'
import cityRouter from "./routes/city.routes.js"

const app = express()

app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://relocation-companion-six.vercel.app"
    ],
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Backend + DB working 🚀");
});

app.use("/api/v1/users", userRouter)
app.use("/api/v1/cities", cityRouter)

export { app }