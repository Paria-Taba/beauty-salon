import express from "express"
import type { Request, Response } from "express"
import nodemailer from "nodemailer"
import { Message } from "../models/message.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js"
import { io } from "../server.js"
import { createMessageSchema, replySchema } from "../validation/message.validation.js"
import type { CreateMessageInput, ReplyInput } from "../validation/message.validation.js"

const router = express.Router()

// POST /api/messages
router.post(
  "/messages",
  validate(createMessageSchema),
  async (
    req: Request<{}, {}, CreateMessageInput>,
    res: Response
  ): Promise<Response> => {
    try {
      const message = await Message.create(req.body)
      io.emit("new_message", message)
      return res.status(201).json(message)
    } catch (error: any) {
      console.error("CREATE MESSAGE ERROR:", error)
      return res.status(500).json({
        error: error.message || "Kunde inte spara meddelande"
      })
    }
  }
)

// GET /api/messages
router.get(
  "/messages",
  verifyToken,
  async (_req: Request, res: Response): Promise<Response> => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 })
      return res.json(messages)
    } catch (error: any) {
      console.error("GET MESSAGES ERROR:", error)
      return res.status(500).json({
        error: error.message || "Kunde inte hämta meddelanden"
      })
    }
  }
)

// POST /api/messages/:id/reply
router.post(
  "/messages/:id/reply",
  verifyToken,
  validate(replySchema),
  async (
    req: Request<{ id: string }, {}, ReplyInput>,
    res: Response
  ): Promise<Response> => {
    try {
      console.log("1️⃣ Reply route started")

      const message = await Message.findById(req.params.id)
      console.log("2️⃣ Message lookup done")

      if (!message) {
        return res.status(404).json({ error: "Meddelande hittades inte" })
      }

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials saknas")
      }

      console.log("3️⃣ Creating transporter...")

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
      })

      console.log("4️⃣ Sending email...")

      await transporter.sendMail({
        from: `"Mary7 Salon" <${process.env.EMAIL_USER}>`,
        to: message.email,
        subject: "Svar från Mary7 Salon",
        html: `
          <h3>Hej!</h3>
          <p>${req.body.reply}</p>
          <br/>
          <p>Vänliga hälsningar,<br/>Mary7 Salon</p>
        `
      })

      console.log("5️⃣ Email sent successfully")

      message.reply = req.body.reply
      message.answered = true
      await message.save()

      io.emit("update_message", message)

      return res.json({ message: "Svar skickat och sparat" })
    } catch (error: any) {
      console.error("🔥 EMAIL ERROR:", error)
      return res.status(500).json({
        error: error.message || "Kunde inte skicka e-post"
      })
    }
  }
)

export default router