import express from "express"
import { Behandling } from "../models/behandling.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import type { Request, Response } from "express"


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

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedBehandling = await Behandling.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        icon: req.body.icon
      },
      { new: true } 
    )

    if (!updatedBehandling) {
      return res.status(404).json({ error: "Behandling hittades inte" })
    }

    res.json(updatedBehandling)

  } catch (error) {
    res.status(400).json({ error: "Kunde inte uppdatera behandling" })
  }
})

router.post("/:id/services",verifyToken, async (req, res) => {
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

router.delete(
  "/:id/services/:serviceId",
  verifyToken,
  async (
    req: Request<{ id: string; serviceId: string }>,
    res: Response
  ) => {
    try {
      const { id, serviceId } = req.params

      const behandling = await Behandling.findById(id)

      if (!behandling) {
        return res.status(404).json({ error: "Behandling hittades inte" })
      }

      const service = behandling.services.id(serviceId)

      if (!service) {
        return res.status(404).json({ error: "Tjänst hittades inte" })
      }

      service.deleteOne()
      await behandling.save()

      res.json({ message: "Tjänst borttagen" })

    } catch (error) {
      res.status(500).json({ error: "Kunde inte ta bort tjänst" })
    }
  }
)

export default router
