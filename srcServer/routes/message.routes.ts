import express from "express"
import { Message } from "../models/message.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import nodemailer from "nodemailer"
import { io } from "../server.js"

const router = express.Router()


// CREATE MESSAGE (Public)

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

    //  REALTIME EMIT
    io.emit("new_message", newMessage)

    res.status(201).json(newMessage)

  } catch (error) {
    res.status(500).json({ error: "Kunde inte spara meddelande" })
  }
})


// READ ALL MESSAGES (Admin)

router.get("/messages", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch {
    res.status(500).json({ error: "Kunde inte hämta meddelanden" })
  }
})



// DELETE MESSAGE (Admin)

router.delete("/messages/:id", verifyToken, async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id)

    if (!deletedMessage) {
      return res.status(404).json({ error: "Meddelande hittades inte" })
    }

    //  REALTIME EMIT
    io.emit("delete_message", deletedMessage._id)

    res.json({ message: "Meddelande borttaget" })

  } catch {
    res.status(500).json({ error: "Kunde inte ta bort meddelande" })
  }
})



// GET ONE MESSAGE

router.get("/messages/:id", verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
    res.json(message)
  } catch {
    res.status(500).json({ error: "Kunde inte hämta meddelande" })
  }
})


// REPLY TO MESSAGE

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
      from: `"Mary7 Salon" <${process.env.EMAIL_USER}>`,
      to: message.email,
      subject: "Svar från Mary7 Salon",
      html: `
        <h3>Hej!</h3>
        <p>${reply}</p>
        <br/>
        <p>
          Om du vill kontakta oss direkt, vänligen skicka ett mejl till
          maralparviz86@gmail.com
        </p>
        <p>Vänliga hälsningar,<br/>Mary7 Salon</p>
      `
    })

    //  Update DB
    message.reply = reply
    message.answered = true
    await message.save()

    //  REALTIME UPDATE
    io.emit("update_message", message)

    res.json({ message: "Svar skickat och sparat" })

  } catch {
    res.status(500).json({ error: "Kunde inte skicka e-post" })
  }
})

export default router