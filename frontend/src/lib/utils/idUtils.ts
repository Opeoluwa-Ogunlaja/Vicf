import { nanoid } from 'nanoid'
import slugify from 'slugify'
import * as bson from 'bson'

export const generateListingId = () => nanoid(6)

export const slugifiedId = (name: string, id: string | number) => slugify(`${name} ${id}`, '_')

export const generateMongoId = () => new bson.ObjectId().toString()

export const generateTaskId = () => nanoid(4)

export const convertSlug = (
  currentType: 'title_number' | 'title_hash',
  listing_title: string,
  position: number
): string => {
  let newSlug: string = ''
  if (currentType == 'title_hash') {
    newSlug = slugifiedId(listing_title, nanoid(6))
  } else {
    newSlug = slugifiedId(listing_title, position.toString())
  }

  return newSlug
}
