import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import path from "path"
import { fileURLToPath } from "url"

import { connectDB } from "./config/db.js"
import serviceRoutes from "./routes/behandling.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import messageRoute from "./routes/message.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

// FIX __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Correct PORT for Render
const port: number = Number(process.env.PORT) || 1337

const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)
})

connectDB()

//  FIX STATIC PATH 
app.use(
  express.static(
    path.join(__dirname, "../../dist")
  )
)

//  API routes
app.use("/api/admin", adminRoutes)
app.use("/api/behandlingar", serviceRoutes)
app.use("/api", messageRoute)

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../dist/index.html")
  )
})

server.listen(port, () => {
  console.log("Server running on port " + port)
})