import userService, { UserService } from './../services/UserService'
import { IContactGroup, IContactGroupDocument, IOrganisation } from '../types'
import organisationService, { OrganisationService } from '../services/OrganisationService'
import { ForbiddenError, NotFoundError } from '../lib/utils/AppErrors'
import { contactsRepository, ContactsRepository } from '../repositories/ContactsRepository'
import {
  contactGroupsRepository,
  ContactGroupsRepository
} from '../repositories/ContactGroupsRepository'

export class ContactUseCases {
  contacts_repository: ContactsRepository
  groups_repository: ContactGroupsRepository
  user_service: UserService
  organisations_service: OrganisationService

  constructor(
    contactsRepository: ContactsRepository,
    groupsRepository: ContactGroupsRepository,
    userService: UserService,
    organisationsService: OrganisationService
  ) {
    this.contacts_repository = contactsRepository
    this.groups_repository = groupsRepository
    this.user_service = userService
    this.organisations_service = organisationsService
  }

  CreateContactAndUpdate = async (userId: string, data: Partial<IContactGroupDocument>) => {
    return await this.groups_repository.runInTransaction(async session => {
      const group = await this.groups_repository.create({ ...data, userId }, session)
      await this.user_service.add_contact_group_to_user(userId, group.id, session)
      return group
    })
  }

  CreateContactForOrganisation = async (
    userId: string,
    organisationId: string,
    data: Partial<IContactGroup> & { _id?: string }
  ) => {
    const organisationFound =
      await this.organisations_service.get_organisation_by_id(organisationId)
    if (!organisationFound) throw new NotFoundError('Organisation')
    if (
      !this.organisations_service.verify_organisation_member(
        organisationId,
        userId,
        organisationFound.toObject()
      )
    )
      throw new ForbiddenError('You are not a member of this group')
    if (!organisationFound.members.includes(userId))
      throw new ForbiddenError('You are not a member of the organisation')
    return await this.groups_repository.runInTransaction(async session => {
      const group = await this.groups_repository.create(
        { ...data, userId, organisation: organisationId },
        session
      )
      await this.user_service.add_contact_group_to_user(userId, group.id, session)
      return group
    })
  }
}

export const contactUseCases = new ContactUseCases(
  contactsRepository,
  contactGroupsRepository,
  userService,
  organisationService
)
