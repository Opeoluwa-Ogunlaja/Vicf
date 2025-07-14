import expressAsyncHandler from 'express-async-handler'
import { contactService, ContactService } from '../services/ContactService'
import { AsyncHandler, IContact, IContactGroup, SocketHandlerFn } from '../types'
import {
  createContactGroupSchema,
  createContactGroupType,
  createContactSchema,
  createContactType,
  updateContactInputBackupSchema
} from '../validators/contactsValidators'
import { flattenZodErrorMessage } from '../lib/utils/zodErrors'
import { AccessError, RequestError } from './../lib/utils/AppErrors'
import { contactUseCases, ContactUseCases } from '../use cases/ContactUseCases'
import { z } from 'zod'

export class ContactsController {
  service: ContactService
  use_case: ContactUseCases
  constructor(service: ContactService, use_case: ContactUseCases) {
    this.service = service
    this.use_case = use_case
  }

  create_group: AsyncHandler<createContactGroupType, Partial<IContactGroup>> = async (req, res) => {
    const userId = req?.user?.id
    const validation = await createContactGroupSchema.safeParseAsync(req.body)
    if (!validation.success) throw new RequestError(flattenZodErrorMessage(validation.error.errors))
    const { url_id, description, name } = validation.data

    const newContact = await this.use_case.CreateContactAndUpdate(userId, {
      url_id,
      description,
      name
    })

    if (!newContact) throw new Error("Could'nt complete your request")

    res.json({
      ok: true,
      data: newContact.toJSON()!
    })
  }

  create_organisation_group: AsyncHandler<
    createContactGroupType,
    Partial<IContactGroup>,
    { organisationId: string }
  > = async (req, res) => {
    const { organisationId } = req.params
    const userId = req?.user?.id
    const validation = await createContactGroupSchema.safeParseAsync(req.body)
    if (!validation.success) throw new RequestError(flattenZodErrorMessage(validation.error.errors))
    const { url_id, description, name } = validation.data

    const newContact = await this.use_case.CreateContactForOrganisation(userId, organisationId, {
      url_id,
      description,
      name
    })

    if (!newContact) throw new Error("Could'nt complete your request")

    res.json({
      ok: true,
      data: newContact.toJSON()!
    })
  }

  get_manager: AsyncHandler<{}, {}> = async (req, res) => {
    const userId = req.user?.id
    const manager = await this.service.getManagerForUser(userId)
    res.json({ ok: true, data: manager })
  }

  get_contacts: AsyncHandler<{}, {}, { listingId: string }> = async (req, res) => {
    const userId = req.user?.id
    const listingId = req.params.listingId

    const contacts = await this.service.getContactsForListing(listingId, userId)

    res.json({ ok: true, data: contacts })
  }

  get_contact_listing: AsyncHandler<{}, any, { listingId: string }> = async (req, res) => {
    const userId = req.user?.id
    const listingId = req.params.listingId

    const listing = await this.service.getListingByUrl(listingId, userId)

    res.json({ ok: true, data: listing })
  }

  update_input_backup: AsyncHandler<Partial<IContact>, IContactGroup, { listingId: string }> =
    async (req, res) => {
      const listingId = req.params.listingId
      const validation = await updateContactInputBackupSchema.partial().safeParseAsync(req.body)
      if (!validation.success)
        throw new RequestError(flattenZodErrorMessage(validation.error.errors))
      const backup = validation.data
      const manager = await this.service.updateManagerInputBackup(listingId, backup as IContact)
      res.json({ ok: true, data: manager?.toJSON() })
    }

  update_listing_name: AsyncHandler<{ name: string }, IContactGroup, { listingId: string }> =
    async (req, res) => {
      const listingId = req.params.listingId
      const listingInfo = await this.service.getListingTitleAndSlugType(listingId)
      if (!listingInfo) throw new RequestError('Invalid action')
      const validation = await z.string().safeParseAsync(req.body.name)
      if (!validation.success)
        throw new RequestError(flattenZodErrorMessage(validation.error.errors))
      const manager = await this.service.groups_repository.runInTransaction(async session => {
        const updated_manager = await this.service.updateManager(
          listingId,
          { name: validation.data },
          session!
        )
        await this.service.migrateSlugs(
          listingId,
          listingInfo.preferences.slug_type,
          validation.data,
          session
        )
        return updated_manager
      })
      res.json({ ok: true, data: manager?.toJSON() })
    }

  update_slug_type: AsyncHandler<
    { slug_type: 'title_number' | 'title_hash' },
    any,
    { listingId: string }
  > = async (req, res) => {
    const slug_type = req.body.slug_type
    const listingId = req.params.listingId
    const listingInfo = await this.service.getListingTitleAndSlugType(listingId)
    if (!listingInfo) throw new RequestError('Invalid action')

    await this.service.groups_repository.runInTransaction(async session => {
      await this.service.updateManager(
        listingId,
        {
          'preferences.slug_type': slug_type
        },
        session
      )
      await this.service.migrateSlugs(listingId, slug_type, listingInfo.name, session)
    })

    res.json({ ok: true, data: {} })
  }

  delete_contact: AsyncHandler<{}, {}, { listingId: string; contactId: string }> = async (
    req,
    res
  ) => {
    const { listingId, contactId } = req.params

    const deletedContact = await this.service.deleteContact(listingId, contactId)
    res.json({ ok: true, data: { ...deletedContact?.toObject() } })
  }

  socket_add_contact: SocketHandlerFn<Partial<IContact> & { listingId: string }> = async (
    message,
    socket,
    clients
  ) => {
    const listingFound = await this.service.getManagerForUser(message.listingId)
    if (!listingFound) throw new AccessError('You are not the owner of the listing')
    const validation = await createContactSchema.partial().strip().safeParseAsync(message)
    if (!validation.success) throw new RequestError(flattenZodErrorMessage(validation.error.errors))
    const contactToAdd = validation.data as createContactType

    const contact = await this.service.addContact(message.listingId, {
      name: contactToAdd.name,
      _id: contactToAdd._id,
      number: contactToAdd.number,
      additional_information: contactToAdd.additional_information,
      email: contactToAdd.email,
      overwrite: contactToAdd.overwrite,
      overwrite_name: contactToAdd.overwrite_name
    })
    socket.emit('add-contact', contactToAdd)
  }
}

export const contactsController: ContactsController = new Proxy(
  new ContactsController(contactService, contactUseCases),
  {
    get(target: ContactsController, prop: keyof ContactsController) {
      const obj = target[prop]

      if (typeof obj == 'function') {
        if (obj.name.startsWith('socket_')) return obj
        return expressAsyncHandler(obj as (req: any, res: any, next: any) => any)
      }

      return obj
    }
  }
)
