import express from "express"
import { Service } from "../models/service.model.js"

const router = express.Router()

// CREATE
router.post("/", async (req, res) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json(service)
  } catch (error) {
    res.status(400).json({ error: "Kunde inte skapa service" })
  }
})

// READ ALL
router.get("/", async (req, res) => {
  const services = await Service.find()
  res.json(services)
})

export default router
