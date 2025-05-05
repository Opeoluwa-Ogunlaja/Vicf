import { z } from 'zod'
import { zMongoId } from '../lib/validators/validateMongodbId'

export const createContactGroupSchema = z
  .object({
    url_id: z.string(),
    description: z.string().nonempty().optional(),
    name: z.string().nonempty().optional()
  })
  .strip()

export const updateContactInputBackupSchema = z
  .object({
    number: z.string(),
    email: z.string(),
    additional_information: z.record(z.string()),
    overwrite: z.boolean(),
    overwrite_name: z.string()
  })
  .strip()

export const createContactSchema = z.object({
  _id: zMongoId,
  name: z.string(),
  number: z.string(),
  email: z.string(),
  additional_information: z.record(z.string()),
  overwrite: z.boolean(),
  overwrite_name: z.string()
})

export type createContactType = z.infer<typeof createContactSchema>

export type createContactGroupType = z.infer<typeof createContactGroupSchema>
