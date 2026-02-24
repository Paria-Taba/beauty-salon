import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import { connectDB } from "./config/db.js"
import serviceRoutes from "./routes/behandling.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import messageRoute from "./routes/message.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

const port: number = Number(process.env.PORT) || 1337


const server = http.createServer(app)


export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)
})

connectDB()

app.use(express.static("./dist"))
app.use("/api/admin", adminRoutes)
app.use("/api/behandlingar", serviceRoutes)
app.use("/api", messageRoute)

server.listen(port, () => {
  console.log("Server running on port " + port)
})