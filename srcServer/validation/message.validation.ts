import { z } from "zod"

export const createMessageSchema = z.object({
  email: z.string().email("Ogiltig e-postadress"),
  text: z.string().min(1, "Meddelandet måste vara minst 1 tecken")
})

export const replySchema = z.object({
  reply: z.string().min(3, "Svar måste vara minst 3 tecken")
})

export type CreateMessageInput =
  z.infer<typeof createMessageSchema>

export type ReplyInput =
  z.infer<typeof replySchema>