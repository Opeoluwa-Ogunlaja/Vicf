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
  // --- TEMPLATE: Add ContactService Methods ---
  async update_contact(contactId: string, data: UpdateQuery<IContact>) {
    // Update a contact by ID
    return await this.contacts_repository.update_contact(contactId, data)
  }

  async unlock_contact(contactId: string){
    return await this.contacts_repository.updateById(contactId, { locked: false, $unset: { locked_by: 1 } })
  }

  async getContactById(contactId: string) {
    // TODO: Implement get contact by id
    return await this.contacts_repository.findById(contactId)
  }
  // --- END TEMPLATE ---
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
  
  async getManagerEditing(listingId: string){
    const manager = await this.groups_repository.getModel().findById(listingId).select('users_editing').populate<{user_editing: { _id: string, name: string, email: string, id: string }}>({ path: 'users_editing', select: 'name email' })
    return manager?.users_editing
  }

  async getListingByUrl(listing_id: string, user_id: string) {
    return await this.groups_repository.findOne({ url_id: listing_id, userId: user_id })
  }

  async getListingTitleAndSlugType(listingId: string) {
    return await this.groups_repository.group_dal
      .getModel()
      .findById(listingId)
      .select('name preferences')
  }

  async migrateSlugs(
    listingId: string,
    listingSlugType: 'title_number' | 'title_hash',
    listingTitle: string,
    session?: ClientSession
  ) {
    const MyModel = this.contacts_repository.contact_dal.getModel()
    const batchSize = 500
    const cursor = MyModel.find(
      { contact_group: listingId, overwrite: false },
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
          position++
        }
      } catch (err: any) {
        console.warn(`Skipping doc ${doc._id}: ${err.message}`)
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
      {
        $lookup: {
          as: 'matchedOrgs',
          foreignField: '_id',
          localField: 'organisation',
          from: 'organisations',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {  $in: [ new mongoose.Types.ObjectId(userId), '$members' ] },
                    // {  $eq: ['$creator', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            },
            {
              $project: {
                _id: 1,
                name: 1
              }
            }
          ]
        }
      },
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] },
              { $in: ['$organisation', '$matchedOrgs._id'] }
            ],
          },
        }
      },
      {
        $unset: 'contacts'
      },
      {
        $set: {
          organisation: {
            $first: '$matchedOrgs'
          }
        }
      },
      {  $lookup: {
          as: 'users_editing',
          foreignField: '_id',
          localField: 'users_editing',
          from: 'users',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1
              }
            }
          ]
        }
      },
      {
        $project: {
          matchedOrgs: 0
        }
      }
    ])

    return manager
  }

  async getManager(listingId: string){
    const manager = await this.groups_repository.getModel().findById(listingId)
    if (!manager) throw new NotFoundError('Contact Group')

    return manager
  }

  async getContactsForListing(listingId: string, userId: string) {
    const manager = await this.groups_repository.getContactsForGroup(userId, listingId)
    if (!manager) throw new NotFoundError('Contact Group')

    return manager!.contacts.map((contact) => {
      return {
        ...(contact as any).toObject(),
        number: contact.number,
        email: contact.email,
        numberEncrypted: undefined,
        numberHash: undefined,
        emailEncrypted: undefined,
        emailHash: undefined,
      }
    })
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
    const transaction_res = await this.groups_repository.runInTransaction(async session => {
      const createdContact = await this.contacts_repository.create({
        ...contact,
        _id: contact._id,
        contact_group: listingId
      })
      const updatedManager = this.updateManager(listingId, {
        $inc: {
          contacts_count: 1
        },
        $push: {
          contacts: contact._id
        }
      })

      return [createdContact, updatedManager]
    })

    return transaction_res
  }

  async deleteContact(listingId: string, contactId: string) {
    const deletedContact = await this.contacts_repository.runInTransaction(async session => {
      let deleted = await this.contacts_repository.deleteContact(contactId, session)

      if (deleted)
        await this.updateManager(
          listingId,
          {
            $inc: {
              contacts_count: -1
            },
            $pull: {
              contacts: contactId
            }
          },
          session
        )

      return deleted
    })

    return deletedContact
  }

  async deleteContactListing(listingId: string) {
    const deletedContact = await this.groups_repository.runInTransaction(async session => {
      let deleted = await this.groups_repository.deleteById(listingId, session)
      return deleted
    })

    return deletedContact
  }
}

export const contactService = new ContactService(contactGroupsRepository, contactsRepository)
