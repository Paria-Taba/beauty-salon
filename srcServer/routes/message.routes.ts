import express from "express"
import type { Request, Response } from "express"

import nodemailer from "nodemailer"

import { Message } from "../models/message.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js"
import { io } from "../server.js"

import {
  createMessageSchema,
  replySchema
} from "../validation/message.validation.js"

import type {
  CreateMessageInput,
  ReplyInput
} from "../validation/message.validation.js"

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
      return res.status(500).json({
        error: "Kunde inte spara meddelande"
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
      const messages = await Message.find().sort({
        createdAt: -1
      })
      return res.json(messages)
    } catch {
      return res.status(500).json({
        error: "Kunde inte hämta meddelanden"
      })
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
        return res.status(404).json({
          error: "Meddelande hittades inte"
        })
      }

      return res.json(message)
    } catch {
      return res.status(500).json({
        error: "Kunde inte hämta meddelande"
      })
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
      const deleted = await Message.findByIdAndDelete(
        req.params.id
      )

      if (!deleted) {
        return res.status(404).json({
          error: "Meddelande hittades inte"
        })
      }

      io.emit("delete_message", deleted._id.toString())

      return res.json({
        message: "Meddelande borttaget"
      })
    } catch {
      return res.status(500).json({
        error: "Kunde inte ta bort meddelande"
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
      const message = await Message.findById(req.params.id)

      if (!message) {
        return res.status(404).json({
          error: "Meddelande hittades inte"
        })
      }

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials saknas")
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      })

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

      message.reply = req.body.reply
      message.answered = true
      await message.save()

      io.emit("update_message", message)

      return res.json({
        message: "Svar skickat och sparat"
      })
    } catch {
      return res.status(500).json({
        error: "Kunde inte skicka e-post"
      })
    }
  }
)

export default router