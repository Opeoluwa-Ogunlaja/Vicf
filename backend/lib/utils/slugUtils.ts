import slugify from 'slugify'

export const slugifiedId = (name: string, id: string | number) => slugify(`${name} ${id}`, '_')
