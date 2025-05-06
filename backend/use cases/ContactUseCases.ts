import { userRepository, UserRepository } from './../repositories/UserRepository'
import {
  contactGroupsRepository,
  ContactGroupsRepository
} from './../repositories/ContactGroupsRepository'
import { contactsRepository, ContactsRepository } from './../repositories/ContactsRepository'
import { IContactGroupDocument } from '../types'

export class ContactUseCases {
  user_repository: UserRepository
  groups_repository: ContactGroupsRepository
  contacts_repository: ContactsRepository
  constructor(
    userRepository: UserRepository,
    groupsRepository: ContactGroupsRepository,
    contactsRepository: ContactsRepository
  ) {
    ;(this.user_repository = userRepository), (this.groups_repository = groupsRepository)
    this.contacts_repository = contactsRepository
  }

  CreateContactAndUpdate = async (userId: string, data: Partial<IContactGroupDocument>) => {
    return await this.groups_repository.runInTransaction(async session => {
      const group = await this.groups_repository.create({ ...data, userId }, session)
      await this.user_repository.updateById(
        userId,
        {
          $push: {
            contact_groupings: group.id
          }
        },
        session
      )
      return group
    })
  }
}

export const contactUseCases = new ContactUseCases(
  userRepository,
  contactGroupsRepository,
  contactsRepository
)
