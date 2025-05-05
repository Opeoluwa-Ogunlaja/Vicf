export function flattenZodErrorMessage<T>(errors: T) {
  if (typeof errors === 'string') return errors
  if (Array.isArray(errors))
    return errors
      .map((error: { message: any }) => ' ' + error.message)
      .join(';-;')
      .trim()
}
