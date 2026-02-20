import express from "express"
import { Message } from "../models/message.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import nodemailer from "nodemailer"

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
router.get("/messages/:id", verifyToken, async (req, res) => {
  const message = await Message.findById(req.params.id)
  res.json(message)
})

router.post("/messages/:id/reply", verifyToken, async (req, res) => {
  try {
    const { reply } = req.body

    const message = await Message.findById(req.params.id)

    if (!message) {
      return res.status(404).json({ error: "Meddelande hittades inte" })
    }

    //  Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    //  Send email
    await transporter.sendMail({
      from: "maralparviz86@gmail.com",
      to: message.email,
      subject: "Svar från Mary7 Salon",
      html: `
        <h3>Hej!</h3>
        <p>${reply}</p>
        <br/>
        <p>Vänliga hälsningar,<br/>Mary7 Salon</p>
      `
    })

    //  Update message status
    message.reply = reply
    message.answered = true
    await message.save()

    res.json({ message: "Svar skickat och sparat" })

  } catch (error) {
    res.status(500).json({ error: "Kunde inte skicka e-post" })
  }
})
export default router