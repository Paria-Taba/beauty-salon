import { z } from "zod"

export const behandlingSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  icon: z.string().min(1),
  images: z.array(z.string()).default([])
})

export const serviceSchema = z.object({
  name: z.string().min(2),
  price: z.string().min(1),
  description: z.string().min(3)
})

export type BehandlingInput = z.infer<typeof behandlingSchema>
export type ServiceInput = z.infer<typeof serviceSchema>