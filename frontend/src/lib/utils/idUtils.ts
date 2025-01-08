import { nanoid } from 'nanoid'
import slugify from 'slugify'
import * as bson from 'bson'

export const generateListingId = () => nanoid(6)

export const slugifiedId = (name: string, id: string | number) => slugify(`${name} ${id}`, '_')

export const generateMongoId = () => new bson.ObjectId().toString()
