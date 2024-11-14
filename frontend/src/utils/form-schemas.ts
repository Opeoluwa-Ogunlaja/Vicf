import * as z from 'zod'
import parsePhoneNumber from 'libphonenumber-js'

export const phoneNumberType = z.string().transform((value, ctx) => {
  const phoneNumber = parsePhoneNumber(value, {
    defaultCountry: 'NG'
  })

  if (!phoneNumber?.isValid()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid phone number'
    })
    return z.NEVER
  }

  return phoneNumber.formatInternational()
})

export const ContactFormSchema = z.object({
  number: phoneNumberType,
  email: z.string().email({ message: 'This must be a valid email' }).optional()
})

export type ContactFormType = z.infer<typeof ContactFormSchema>
