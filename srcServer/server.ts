import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import serviceRoutes from "./routes/behandling.routes.js"

const app = express()
console.log("ENV TEST:", process.env.MONGO_URI)

app.use(cors())
app.use(express.json())

const port: number = Number(process.env.PORT) || 1337

// Connect MongoDB
connectDB()
app.use("/api/behandlingar", serviceRoutes)

// Serve frontend build
app.use(express.static("./dist"))

app.listen(port, () => {
  console.log("Server running on port " + port)
})
