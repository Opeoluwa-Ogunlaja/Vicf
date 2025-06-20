import mongoose, { ClientSession, RootFilterQuery } from 'mongoose'
import MongooseDAL from '../data access layers/MongooseDal'
import Contact, { ContactModelType } from '../entities/Contact'
import { IContactDocument } from '../types'
import { IContact } from './../types/contacts.d'

export class ContactsRepository {
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
