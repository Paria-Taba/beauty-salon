import type { Request, Response, NextFunction } from "express"
import type { ZodSchema, ZodError } from "zod"

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const firstError =
        result.error.issues?.[0]?.message ||
        "Ogiltig inmatning"

      return res.status(400).json({
        error: firstError
      })
    }

    req.body = result.data
    next()
  }