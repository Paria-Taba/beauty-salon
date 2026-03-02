import express from "express"
import type { Request, Response } from "express"

import { Behandling } from "../models/behandling.model.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import { validate } from "../middleware/validate.middleware.js"
import { io } from "../server.js"

import {
  behandlingSchema,
  serviceSchema
} from "../validation/behandling.validation.js"

import type {
  BehandlingInput,
  ServiceInput
} from "../validation/behandling.validation.js"

const router = express.Router()



router.post(
  "/",
  verifyToken,
  validate(behandlingSchema),
  async (
    req: Request<{}, {}, BehandlingInput>,
    res: Response
  ): Promise<Response> => {
    try {
      const behandling = await Behandling.create(req.body)

      io.emit("new_behandling", behandling)

      return res.status(201).json(behandling)
    } catch {
      return res.status(400).json({
        error: "Kunde inte skapa behandling"
      })
    }
  }
)



router.get(
  "/",
  async (_req: Request, res: Response): Promise<Response> => {
    try {
      const behandlingar = await Behandling.find()

      return res.json(behandlingar)
    } catch {
      return res.status(500).json({
        error: "Kunde inte hämta behandlingar"
      })
    }
  }
)


router.get(
  "/:id",
  async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const behandling = await Behandling.findById(req.params.id)

      if (!behandling) {
        return res.status(404).json({
          error: "Behandling hittades inte"
        })
      }

      return res.json(behandling)
    } catch {
      return res.status(404).json({
        error: "Behandling hittades inte"
      })
    }
  }
)


router.put(
  "/:id",
  verifyToken,
  validate(behandlingSchema),
  async (
    req: Request<{ id: string }, {}, BehandlingInput>,
    res: Response
  ): Promise<Response> => {
    try {
      const updated = await Behandling.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      )

      if (!updated) {
        return res.status(404).json({
          error: "Behandling hittades inte"
        })
      }

      io.emit("update_behandling", updated)

      return res.json(updated)
    } catch {
      return res.status(400).json({
        error: "Kunde inte uppdatera behandling"
      })
    }
  }
)



router.delete(
  "/:id",
  verifyToken,
  async (
    req: Request<{ id: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const deleted = await Behandling.findByIdAndDelete(
        req.params.id
      )

      if (!deleted) {
        return res.status(404).json({
          error: "Behandling hittades inte"
        })
      }

      io.emit("delete_behandling", deleted._id.toString())

      return res.json({
        message: "Behandling borttagen"
      })
    } catch {
      return res.status(500).json({
        error: "Kunde inte ta bort behandling"
      })
    }
  }
)


router.post(
  "/:id/services",
  verifyToken,
  validate(serviceSchema),
  async (
    req: Request<{ id: string }, {}, ServiceInput>,
    res: Response
  ): Promise<Response> => {
    try {
      const behandling = await Behandling.findById(req.params.id)

      if (!behandling) {
        return res.status(404).json({
          error: "Behandling hittades inte"
        })
      }

      behandling.services.push(req.body)
      await behandling.save()

      io.emit("update_behandling", behandling)

      return res.json(behandling)
    } catch {
      return res.status(400).json({
        error: "Kunde inte lägga till service"
      })
    }
  }
)


router.delete(
  "/:id/services/:serviceId",
  verifyToken,
  async (
    req: Request<{ id: string; serviceId: string }>,
    res: Response
  ): Promise<Response> => {
    try {
      const { id, serviceId } = req.params

      const behandling = await Behandling.findById(id)

      if (!behandling) {
        return res.status(404).json({
          error: "Behandling hittades inte"
        })
      }

      const service = behandling.services.id(serviceId)

      if (!service) {
        return res.status(404).json({
          error: "Tjänst hittades inte"
        })
      }

      service.deleteOne()
      await behandling.save()

      io.emit("update_behandling", behandling)

      return res.json({
        message: "Tjänst borttagen"
      })
    } catch {
      return res.status(500).json({
        error: "Kunde inte ta bort tjänst"
      })
    }
  }
)

export default router