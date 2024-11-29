import * as z from 'zod'
import parsePhoneNumber from 'libphonenumber-js'

export const phoneNumberType = z.string().transform((value, ctx) => {
  const phoneNumber = parsePhoneNumber(value, {
    extract: true,
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
  email: z
    .optional(z.string().email(), { invalid_type_error: 'This must be a valid email' })
    .or(z.literal('')),
  overwrite: z.boolean().default(false),
  overwrite_name: z.optional(z.string())
})

export type ContactFormType = z.infer<typeof ContactFormSchema>

export const LoginFormSchema = z.object({
  name: z.string(),
  email: z
    .optional(z.string().email(), { invalid_type_error: 'This must be a valid email' })
    .or(z.literal('')),
  password: z.string()
})

export type LoginFormType = z.infer<typeof LoginFormSchema>

export const SignupFormSchema = z.object({
  name: z.string(),
  email: z
    .optional(z.string().email(), { invalid_type_error: 'This must be a valid email' })
    .or(z.literal('')),
  password: z.string()
})

export type SignupFormType = z.infer<typeof SignupFormSchema>
