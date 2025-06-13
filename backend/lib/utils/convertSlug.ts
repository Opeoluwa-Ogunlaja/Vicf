import slugify from 'slugify'

export const convertSlug = async (
  currentType: 'title_number' | 'title_hash',
  listing_title: string,
  position: number
): Promise<string> => {
  const { nanoid } = await import('nanoid')
  let newSlug: string = ''
  if (currentType == 'title_hash') {
    newSlug = slugify(listing_title, nanoid(6))
  } else {
    newSlug = slugify(listing_title, position.toString())
  }

  return newSlug
}
