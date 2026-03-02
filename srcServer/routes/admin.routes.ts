import express from "express"
import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js"
import { validate } from "../middleware/validate.middleware.js"
import {
  registerSchema,
  loginSchema
} from "../validation/admin.validation.js"

import type {
  RegisterInput,
  LoginInput
} from "../validation/admin.validation.js"

const router = express.Router()

router.post(
  "/register",
  validate(registerSchema),
  async (
    req: Request<{}, {}, RegisterInput>,
    res: Response
  ): Promise<Response> => {
    try {
      const { email, password } = req.body

      const existing = await Admin.findOne({ email })
      if (existing)
        return res.status(400).json({ error: "Admin finns redan" })

      const hashed = await bcrypt.hash(password, 10)

      await Admin.create({ email, password: hashed })

      return res.status(201).json({ message: "Admin skapad" })
    } catch {
      return res.status(500).json({ error: "Serverfel" })
    }
  }
)

router.post(
  "/login",
  validate(loginSchema),
  async (
    req: Request<{}, {}, LoginInput>,
    res: Response
  ): Promise<Response> => {
    try {
      const { email, password } = req.body

      const admin = await Admin.findOne({ email })
      if (!admin)
        return res.status(401).json({ error: "Fel inloggning" })

      const match = await bcrypt.compare(password, admin.password)
      if (!match)
        return res.status(401).json({ error: "Fel inloggning" })

      if (!process.env.JWT_SECRET)
        throw new Error("JWT saknas")

      const token = jwt.sign(
        { id: admin._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "90d" }
      )

      return res.json({ token })
    } catch {
      return res.status(500).json({ error: "Serverfel" })
    }
  }
)

export default router