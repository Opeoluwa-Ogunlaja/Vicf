import { z } from 'zod'

export const userRegisterSchema = z.object({
  name: z.optional(z.string()),
  email: z.string().email(),
  password: z.string()
})

export type userRegisterType = z.infer<typeof userRegisterSchema>

export const createOrganisationSchema = z.object({
  name: z.optional(z.string())
})

export type createOrganisationType = z.infer<typeof createOrganisationSchema>
