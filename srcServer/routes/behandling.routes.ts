import express from "express"
import { Behandling } from "../models/behandling.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()


router.post("/",verifyToken, async (req, res) => {
  try {
    const behandling = await Behandling.create(req.body)
    res.status(201).json(behandling)
  } catch (error) {
    res.status(400).json({ error: "Kunde inte skapa behandling" })
  }
})

// READ ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const behandlingar = await Behandling.find()
    res.json(behandlingar)
  } catch (error) {
    res.status(500).json({ error: "Kunde inte hämta behandlingar" })
  }
})

// READ ONE CATEGORY
router.get("/:id", async (req, res) => {
  try {
    const behandling = await Behandling.findById(req.params.id)
    res.json(behandling)
  } catch (error) {
    res.status(404).json({ error: "Behandling hittades inte" })
  }
})
// DELETE CATEGORY
router.delete("/:id",verifyToken, async (req, res) => {
  try {
    const deletedBehandling = await Behandling.findByIdAndDelete(req.params.id)

    if (!deletedBehandling) {
      return res.status(404).json({ error: "Behandling hittades inte" })
    }

    res.json({ message: "Behandling borttagen" })
  } catch (error) {
    res.status(500).json({ error: "Kunde inte ta bort behandling" })
  }
})

router.post("/:id/behandlingar",verifyToken, async (req, res) => {
  try {
    const behandling = await Behandling.findById(req.params.id)

    if (!behandling) {
      return res.status(404).json({ error: "Behandling hittades inte" })
    }

    behandling.services.push(req.body)
    await behandling.save()

    res.json(behandling)
  } catch (error) {
    res.status(400).json({ error: "Kunde inte lägga till service" })
  }
})


export default router
