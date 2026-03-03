import express from "express"
import type { Request, Response } from "express"
import { Resend } from "resend"
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
    } catch {
      return res.status(500).json({ error: "Kunde inte spara meddelande" })
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
    } catch {
      return res.status(500).json({ error: "Kunde inte hämta meddelanden" })
    }
  }
)

// GET /api/messages/:id
router.get(
  "/messages/:id",
  verifyToken,
  async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const message = await Message.findById(req.params.id)

      if (!message) {
        return res.status(404).json({ error: "Meddelande hittades inte" })
      }

      return res.json(message)
    } catch {
      return res.status(500).json({ error: "Kunde inte hämta meddelande" })
    }
  }
)

// DELETE /api/messages/:id
router.delete(
  "/messages/:id",
  verifyToken,
  async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const deleted = await Message.findByIdAndDelete(req.params.id)

      if (!deleted) {
        return res.status(404).json({ error: "Meddelande hittades inte" })
      }

      io.emit("delete_message", deleted._id.toString())

      return res.json({ message: "Meddelande borttaget" })
    } catch {
      return res.status(500).json({ error: "Kunde inte ta bort meddelande" })
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
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY saknas i .env")
      }

      const resend = new Resend(process.env.RESEND_API_KEY)

      const message = await Message.findById(req.params.id)

      if (!message) {
        return res.status(404).json({ error: "Meddelande hittades inte" })
      }

      await resend.emails.send({
        from: "Mary7 Salon <onboarding@resend.dev>",
        to: message.email,
        subject: "Svar från Mary7 Salon",
        html: `
          <h3>Hej!</h3>
          <p>${req.body.reply}</p>
          <br/>
          <p>Vänliga hälsningar,<br/>Mary7 Salon</p>
          <hr style="margin:20px 0;" />
          <p style="font-size:14px;color:gray;">
            Detta är ett automatiskt e-postmeddelande och kan inte besvaras.<br/>
            Om du vill svara, vänligen kontakta oss på:<br/>
            <strong>maralparviz86@gmail.com</strong><br/>
            Telefon: 073-977 57 55
          </p>
        `
      })

      message.reply = req.body.reply
      message.answered = true
      await message.save()

      io.emit("update_message", message)

      return res.json({ message: "Svar skickat och sparat" })
    } catch (error) {
      console.error("RESEND ERROR:", error)
      return res.status(500).json({ error: "Kunde inte skicka e-post" })
    }
  }
)

export default router