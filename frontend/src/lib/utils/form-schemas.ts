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

export const addInfoFormSchema = z.array(
  z.object({ name: z.string().min(1), description: z.string().min(1) })
)
export type addInfoFormSchemaType = z.infer<typeof addInfoFormSchema>

export const ContactFormSchema = z.object({
  name: z.string(),
  number: phoneNumberType,
  email: z
    .optional(z.string().email(), { invalid_type_error: 'This must be a valid email' })
    .or(z.literal('')),
  additional_information: addInfoFormSchema,
  overwrite: z.boolean().default(false),
  overwrite_name: z.optional(z.string())
})

export type ContactFormType = z.infer<typeof ContactFormSchema>

export const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be a minimum of 8 characters').max(32, 'Haba!')
})

export type LoginFormType = z.infer<typeof LoginFormSchema>

export const SignupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(32, 'Omo!!'),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be a minimum of 8 characters').max(32, 'Haba!')
})

export type SignupFormType = z.infer<typeof SignupFormSchema>
