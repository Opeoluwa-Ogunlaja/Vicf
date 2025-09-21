import mongoose, { ClientSession, RootFilterQuery, UpdateQuery } from 'mongoose'
import MongooseDAL from '../data access layers/MongooseDal'
import Contact, { ContactModelType } from '../entities/Contact'
import { IContactDocument } from '../types'
import { IContact } from './../types/contacts.d'

export class ContactsRepository {
  // --- TEMPLATE: Add ContactsRepository Methods ---
  async update_contact(contactId: string, data: Partial<IContact>) {
    // Update a contact by ID
    return await this.contact_dal.updateById(contactId, data)
  }

    async update_contacts(query: RootFilterQuery<IContact>, data: UpdateQuery<IContact>, session?: ClientSession) {
    // Update a contact by ID
    return await this.contact_dal.updateMany(query, data, session)
  }

  async get_contact(contactId: string) {
    // TODO: Implement get contact by id
    return null
  }
  // --- END TEMPLATE ---
  contact_dal: MongooseDAL<IContactDocument, ContactModelType>
  runInTransaction: typeof this.contact_dal.runInTransaction
  constructor(contact_model: typeof Contact) {
    this.contact_dal = new MongooseDAL<IContactDocument, ContactModelType>(contact_model)
    this.runInTransaction = this.contact_dal.runInTransaction
  }

  generateId = () => {
    return new mongoose.Types.ObjectId()
  }

  async removeChild<T = any>(listingId: string, contactId: string) {
    const parent = (await this.findById(listingId)) as any
    const child = parent.contacts.pull(contactId)
    await parent.save()
    return child
  }

  create = async (data: Partial<IContact> & { _id: string }) => {
    return await this.contact_dal.getModel().create(data)
  }

  async find(query: RootFilterQuery<IContactDocument>, session?: ClientSession) {
    return await this.contact_dal.getMany(query, session)
  }

  async findOne(query: RootFilterQuery<IContactDocument>, session?: ClientSession) {
    return await this.contact_dal.getOne(query, session)
  }

  async findById(id: string, ...args: any[]) {
    return await this.contact_dal.getById(id)
  }

  updateById: typeof this.contact_dal.updateById = async (id, data, session) => {
    return await this.contact_dal.updateById(id, data, session)
  }

  aggregate: typeof this.contact_dal.aggregate = async (...args: any[]) => {
    return await this.contact_dal.aggregate(...args)
  }

  async deleteContact(id: string, session?: ClientSession) {
    return await this.contact_dal.delete(id, session)
  }
}

export const contactsRepository = new ContactsRepository(Contact)
