import mongoose from 'mongoose'
import { z } from 'zod'

const validateMongodbId = (ids: string | string[]): boolean => {
  let isValid

  if (Array.isArray(ids)) {
    isValid = ids.every(id => mongoose.Types.ObjectId.isValid(id))
  } else {
    isValid = mongoose.Types.ObjectId.isValid(ids)
  }


  return isValid
}

export const zMongoId = z.string().transform((value, ctx) => {
  const isValid = mongoose.Types.ObjectId.isValid(value)

  if (!isValid) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid _id'
    })
    return z.NEVER
  }

  return value.toString()
})

export default validateMongodbId
