import { nanoid } from 'nanoid'
import { slugifiedId } from './slugUtils'

export const convertSlug = async (
  currentType: 'title_number' | 'title_hash',
  listing_title: string,
  position: number
): Promise<string> => {
  let newSlug: string = ''
  if (currentType == 'title_hash') {
    newSlug = slugifiedId(listing_title, nanoid(6))
  } else {
    newSlug = slugifiedId(listing_title, position.toString())
  }

  return newSlug
}
