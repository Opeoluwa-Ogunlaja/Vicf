import { nanoid } from 'nanoid'
import slugify from 'slugify'

export const generateListingId = () => nanoid(6)

export const slugifiedId = (name: string, id: string | number) => slugify(`${name} ${id}`, '_')
