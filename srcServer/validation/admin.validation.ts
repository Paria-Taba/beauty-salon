import { z } from "zod"

export const registerSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(6, "Lösenord måste vara minst 6 tecken")
})

export const loginSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(1, "Lösenord krävs")
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>