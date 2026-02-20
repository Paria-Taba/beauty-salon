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
// DELETE MESSAGE (för admin)
router.delete("/messages/:id", verifyToken, async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id)

    if (!deletedMessage) {
      return res.status(404).json({ error: "Meddelande hittades inte" })
    }

    res.json({ message: "Meddelande borttaget" })

  } catch (error) {
    res.status(500).json({ error: "Kunde inte ta bort meddelande" })
  }
})

export default router