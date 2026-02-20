import express from "express"
import { Message } from "../models/message.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// CREATE MESSAGE
router.post("/messages", async (req, res) => {
  try {
    const { email, text } = req.body

    if (!email || !text) {
      return res
        .status(400)
        .json({ error: "E-post och meddelande krävs" })
    }

    const newMessage = await Message.create({
      email,
      text
    })

    res.status(201).json(newMessage)

  } catch (error) {
    res.status(500).json({ error: "Kunde inte spara meddelande" })
  }
})

// READ ALL MESSAGES (för admin)
router.get("/messages",verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch {
    res.status(500).json({ error: "Kunde inte hämta meddelanden" })
  }
})

export default router