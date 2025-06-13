import mongoose, { ClientSession, UpdateQuery } from 'mongoose'
import {
  ContactGroupsRepository,
  contactGroupsRepository
} from '../repositories/ContactGroupsRepository'
import { ContactsRepository, contactsRepository } from '../repositories/ContactsRepository'
import { IContact, IContactGroup, IContactGroupDocument } from '../types'
import { NotFoundError } from '../lib/utils/AppErrors'
import { convertSlug } from '../lib/utils/convertSlug'

export class ContactService {
  groups_repository: ContactGroupsRepository
  contacts_repository: ContactsRepository
  constructor(group_repository: ContactGroupsRepository, contacts_repository: ContactsRepository) {
    this.groups_repository = group_repository
    this.contacts_repository = contacts_repository
  }

  createContactGroup = async (userId: string, data: Partial<IContactGroupDocument>) => {
    return await this.groups_repository.runInTransaction(async session => {
      const group = await this.groups_repository.create({ ...data, userId }, session)
      await this.groups_repository.updateById(
        group.id,
        {
          contacts_count: 1
        },
        session
      )
      return group
    })
  }

  async getListingByUrl(listing_id: string, user_id: string) {
    return await this.groups_repository.findOne({ url_id: listing_id, userId: user_id })
  }

  async getListingTitleAndSlugType(listingId: string) {
    return await this.groups_repository.group_dal
      .getModel()
      .findById(listingId)
      .select('title preferences')
  }

  async migrateSlugs(
    listingId: string,
    listingSlugType: 'title_number' | 'title_hash',
    listingTitle: string,
    session?: ClientSession
  ) {
    const MyModel = this.contacts_repository.contact_dal.getModel()
    const batchSize = 500
    console.log('hello')
    const cursor = MyModel.find(
      { contact_group: listingId, overwrite_name: false },
      { name: 1 }
    ).cursor()
    const bulkOps: any[] = []

    let position = 1
    for await (const doc of cursor) {
      try {
        const newSlug = await convertSlug(listingSlugType, listingTitle, position)
        if (newSlug !== doc.name) {
          bulkOps.push({
            updateOne: {
              filter: { _id: doc._id },
              update: { $set: { name: newSlug } }
            }
          })
        }
        position++
      } catch (err: any) {
        // console.warn(`Skipping doc ${doc._id}: ${err.message}`)
      }

      if (bulkOps.length >= batchSize) {
        await MyModel.bulkWrite(bulkOps, { session })
        bulkOps.length = 0
      }
    }

    if (bulkOps.length > 0) {
      await MyModel.bulkWrite(bulkOps, { session })
    }
  }

  async getManagerForUser(userId: string) {
    const manager = await this.groups_repository.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $unset: 'contacts'
      }
    ])

    return manager
  }

  async getContactsForListing(listingId: string, userId: string) {
    const manager = await this.groups_repository.getContactsForGroup(userId, listingId)
    if (!manager) throw new NotFoundError('Contact Group')

    return manager!.contacts
  }

  async updateManagerInputBackup(listingId: string, backup: Partial<IContact>) {
    return await this.groups_repository.updateById(listingId, {
      input_backup: JSON.stringify({
        number: '',
        email: '',
        additional_information: {},
        overwrite: false,
        overwrite_name: '',
        ...backup
      })
    })
  }

  async updateManager(
    listingId: string,
    listingProps: Partial<IContactGroup> | UpdateQuery<IContactGroup>,
    session?: ClientSession
  ) {
    return await this.groups_repository.updateById(
      listingId,
      {
        ...listingProps
      },
      session
    )
  }

  async addContact(listingId: string, contact: Partial<IContact> & { _id: string }) {
    const id = this.groups_repository.generateId().toString()
    return await Promise.all([
      this.contacts_repository.create({ ...contact, _id: id }),
      this.updateManager(listingId, {
        $inc: {
          contacts_count: 1
        },
        $push: {
          contacts: [id]
        }
      })
    ])
  }

  async deleteContact(listingId: string, contactId: string) {
    const deletedContact = await this.contacts_repository.deleteContact(contactId)

    await this.updateManager(listingId, {
      $inc: {
        contacts_count: -1
      },
      $pull: {
        contacts: [deletedContact!.id]
      }
    })

    return deletedContact
  }
}

export const contactService = new ContactService(contactGroupsRepository, contactsRepository)
