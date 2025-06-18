import mongoose, { ClientSession, RootFilterQuery } from 'mongoose'
import MongooseDAL from '../data access layers/MongooseDal'
import ContactGroup, { ContactGroupModelType } from '../entities/Contact_Group'
import { IContactGroup, IContactGroupDocument } from '../types'

export class ContactGroupsRepository {
  group_dal: MongooseDAL<IContactGroupDocument, ContactGroupModelType>
  runInTransaction: typeof this.group_dal.runInTransaction
  constructor(contacts_group_model: typeof ContactGroup) {
    this.group_dal = new MongooseDAL<IContactGroupDocument, ContactGroupModelType>(
      contacts_group_model
    )
    this.runInTransaction = this.group_dal.runInTransaction
  }

  generateId = () => {
    return new mongoose.Types.ObjectId()
  }

  async addChild<T = any>(listingId: string, child: keyof IContactGroup, content: T) {
    const parent = (await this.findById(listingId)) as any
    parent[child].push(content)
    await parent.save()
  }

  async removeChild<T = any>(listingId: string, contactId: string) {
    const parent = (await this.findById(listingId)) as any
    const child = parent.contacts.pull(contactId)
    await parent.save()
    return child
  }

  async getContactsForGroup(userId: string, groupId: string) {
    return await this.group_dal
      .getModel()
      .findOne({
        userId,
        _id: groupId
      })
      .populate({ path: 'contacts', select: '-contact_group' })
      .select('contacts')
  }

  create = async (data: Partial<IContactGroup>, session?: ClientSession) => {
    return await this.group_dal.create(data, session)
  }

  async findOne(query: RootFilterQuery<IContactGroupDocument>, ...args: any[]) {
    return await this.group_dal.getOne(query, ...args)
  }

  async findById(id: string, ...args: any[]) {
    return await this.group_dal.getById(id)
  }

  updateById: typeof this.group_dal.updateById = async (id, data) => {
    return await this.group_dal.updateById(id, data)
  }

  aggregate: typeof this.group_dal.aggregate = async (...args: any[]) => {
    return await this.group_dal.aggregate(...args)
  }
}

export const contactGroupsRepository = new ContactGroupsRepository(ContactGroup)
