import expressAsyncHandler from 'express-async-handler'
import { Transform, pipeline, Readable } from 'stream';
import { contactService, ContactService } from '../services/ContactService'
import {
  AsyncHandler,
  IContact,
  IContactGroup,
  IContactGroupDocument,
  SocketHandlerFn
} from '../types'
import {
  createContactGroupSchema,
  createContactGroupType,
  createContactSchema,
  createContactType,
  updateContactInputBackupSchema
} from '../validators/contactsValidators'
import { flattenZodErrorMessage } from '../lib/utils/zodErrors'
import { AccessError, NotFoundError, RequestError } from './../lib/utils/AppErrors'
import { contactUseCases, ContactUseCases } from '../use cases/ContactUseCases'
import { z } from 'zod'
import { sendEventToRoom } from '../lib/utils/socketUtils'
import { convertJsonToVcf } from '../lib/utils/vcfConverter';
import { jsonToCsv, jsonToCsvStream } from '../lib/utils/csvConverter';
import { jsonToExcelStream } from '../lib/utils/xlsxConverter';

export class ContactsController {
  update_contact: AsyncHandler<IContact, any, { contactId: string }> = async (req, res) => {
    const { email, overwrite_name, overwrite, additional_information, number } = req.body
    const updated_contact = await this.service.update_contact(req.params.contactId, {
      number, email, overwrite_name, additional_information, overwrite
    })
    
    sendEventToRoom(`${updated_contact?.contact_group}-editing-room`, 'edit-contact', updated_contact?.toObject)
    res.json({ ok: true, data: updated_contact })
  }

  get_contact: AsyncHandler<any, any, { contactId: string }> = async (req, res) => {
    // TODO: Implement get contact by id
    res.json({ ok: true, data: null })
  }

  // --- END TEMPLATE ---
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

    if (!newContact) throw new Error("Couldn't complete your request")

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

  move_manager: AsyncHandler<{ organisationId: string }, any, { listingId: string }> = async (
    req,
    res
  ) => {
    const userId = req.user?.id
    const { listingId } = req.params
    const { organisationId } = req.body
    const moved_manager = await this.use_case.MoveListingToOrganisation(listingId, organisationId)
    res.json({ ok: true, data: moved_manager })
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
    sendEventToRoom(`${listingId}-editing-room`, 'delete-contact', deletedContact?.toObject())
    res.json({ ok: true, data: { ...deletedContact?.toObject() } })
  }

  delete_contact_listing: AsyncHandler<{}, {}, { listingId: string; contactId: string }> = async (
    req,
    res
  ) => {
    const { listingId } = req.params

    const deletedListing = await this.service.deleteContactListing(listingId)
    res.json({ ok: true, data: { ...deletedListing?.toObject() } })
  }

  stream_vcf: AsyncHandler<{}, {}, { listingId: string }> = async (req, res) => {
    const listingId = req.params.listingId;
    const contacts = await this.service.getContactsForListing(listingId, req.user?.id)
    if(!contacts) throw new RequestError("Invalid Listing ID")

    res.setHeader('Content-Type', 'text/vcard');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.vcf');

    const contactStream = Readable.from(contacts);

    const vcfTransform = new Transform({
      objectMode: true,
      transform(contact, _, callback) {
        try {
          const vcf = convertJsonToVcf(contact) + '\n';
          callback(null, vcf);
        } catch (err) {
          callback(err as Error);
        }
      }
    });

    pipeline(contactStream, vcfTransform, res, (err) => {
      if (err) {
        console.error('Pipeline failed', err);
        res.status(500).end('Streaming failed.');
      }
    });
  }

  stream_csv: AsyncHandler<{}, {}, { listingId: string }> = async (req, res) => {
    const listingId = req.params.listingId;
    const contacts = await this.service.getContactsForListing(listingId, req.user?.id)
    if(!contacts) throw new RequestError("Invalid Listing ID")

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');

    pipeline(await jsonToCsvStream(contacts.map((c: any) => c.toObject())), res, (err) => {
      if (err) {
        console.error('Pipeline failed', err);
        res.status(500).end('Streaming failed.');
      }
    });
  }

  stream_xlsx: AsyncHandler<{}, {}, { listingId: string }> = async (req, res) => {
    const listingId = req.params.listingId;
    const contacts = await this.service.getContactsForListing(listingId, req.user?.id)
    if(!contacts) throw new RequestError("Invalid Listing ID")

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.xlsx');

    pipeline(await jsonToExcelStream(contacts.map((c: any) => c.toObject())), res, (err) => {
      if (err) {
        console.error('Pipeline failed', err);
        res.status(500).end('Streaming failed.');
      }
    });
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

    socket.to(`${message.listingId}-editing-room`).emit('add-contact', contactToAdd);
    socket.emit('add-contact', contactToAdd)
  }

  socket_set_editing_contacts: SocketHandlerFn<Partial<IContact> & { listingId: string }> = async (
    message,
    socket,
    clients
  ) => {
    const user = clients.get(socket.id)?.user;
    const { listingId } = message;
    if (!user) throw new AccessError("Not logged in");

    // Add user to editors
    await this.service.updateManager(listingId, {
      $addToSet: { users_editing: (user!._id as string).toString() }
    })

    // Fetch updated editors list
    const updatedEditors = await this.service.getManagerEditing(listingId);

    // Join the editing room if not already
    socket.join(`${listingId}-editing-room`);

    // Emit to all in the room
    socket.to(`${listingId}-editing-room`).emit('editing', {
      listingId,
      editors: updatedEditors
    });
    socket.emit('editing', {
      listingId,
      editors: updatedEditors
    });
  }

  socket_set_not_editing_contacts: SocketHandlerFn<Partial<IContact> & { listingId: string }> = async (
    message,
    socket,
    clients
  ) => {
    const user = clients.get(socket.id)?.user;
    const { listingId } = message;
    if (!user) return;

    // Remove user from editors
    await this.service.updateManager(listingId, {
      $pull: { users_editing: (user!._id as string).toString() }
    });

    // Fetch updated editors list
    const updatedEditors = await this.service.getManagerEditing(listingId);

    // Emit to all in the room
    socket.to(`${listingId}-editing-room`).emit('editing', {
      listingId,
      editors: updatedEditors
    });
    socket.emit('editing', {
      listingId,
      editors: updatedEditors
    });
  }

  socket_lock_contact: SocketHandlerFn<Partial<IContact> & { listingId: string, contactId: string }> = async (
    message,
    socket,
    clients
  ) => {
    const user = clients.get(socket.id)?.user
    const { listingId, contactId } = message
    if (!user) return
    // Lock the contact
    const updatedContact = await this.service.update_contact(contactId, { locked: true, locked_by: (user!._id as string).toString() })
    // Notify all clients in the room
    socket.to(`${listingId}-editing-room`).emit('contact-locked', { contact: updatedContact })
    socket.emit('contact-locked', { contact: updatedContact })
  }

  socket_unlock_contact: SocketHandlerFn<Partial<IContact> & { listingId: string, contactId: string }> = async (
    message,
    socket,
    clients
  ) => {
    const user = clients.get(socket.id)?.user
    const { listingId, contactId } = message
    if (!user) return
    // Unlock the contact
    const updatedContact = await this.service.unlock_contact(contactId)
    // Notify all clients in the room
    socket.to(`${listingId}-editing-room`).emit('contact-unlocked', { contact: updatedContact })
    socket.emit('contact-unlocked', { contact: updatedContact })
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