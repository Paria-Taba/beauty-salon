import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Ingen token tillhandahållen" })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Token saknas" })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string)
    next()
  } catch (error) {
    return res.status(401).json({ error: "Ogiltig eller utgången token" })
  }
}
