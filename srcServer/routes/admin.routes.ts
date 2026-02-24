import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Admin } from "../models/admin.model.js"

const router = express.Router()

// REGISTER ADMIN 
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "E-post och lösenord krävs" })
    }

    const existingAdmin = await Admin.findOne({ email })

    if (existingAdmin) {
      return res.status(400).json({ error: "Admin finns redan" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const admin = await Admin.create({
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: "Admin skapad"
    })

  } catch (error) {
    res.status(400).json({ error: "Kunde inte skapa admin" })
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "E-post och lösenord krävs" })
    }

    const admin = await Admin.findOne({ email })

    if (!admin) {
      return res.status(401).json({ error: "Fel e-post eller lösenord" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)

    if (!isMatch) {
      return res.status(401).json({ error: "Fel e-post eller lösenord" })
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "90d" }
    )

    res.json({ token })

  } catch (error) {
    res.status(500).json({ error: "Serverfel" })
  }
})

export default router
