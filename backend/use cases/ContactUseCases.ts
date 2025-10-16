import userService, { UserService } from './../services/UserService'
import { IContactGroup, IContactGroupDocument, IOrganisation, IContact } from '../types'
import organisationService, { OrganisationService } from '../services/OrganisationService'
import { ForbiddenError, NotFoundError } from '../lib/utils/AppErrors'
import { contactsRepository, ContactsRepository } from '../repositories/ContactsRepository'
import {
  contactGroupsRepository,
  ContactGroupsRepository
} from '../repositories/ContactGroupsRepository'
import { sendEventToRoom } from '../lib/utils/socketUtils'

export class ContactUseCases {
  // --- DASHBOARD STATS METHODS ---
  async countListingsCreatedByUser(userId: string): Promise<number> {
    // TODO: Implement logic to count listings created by user
    return 0
  }

  async countListingsUpdatedToDriveByUser(userId: string): Promise<number> {
    // TODO: Implement logic to count listings updated to drive by user
    return 0
  }
  // --- END DASHBOARD STATS METHODS ---
  // --- TEMPLATE: Add ContactUseCases Methods ---
  async update_contact(userId: string, contactId: string, data: Partial<IContact>) {
    // TODO: Implement update contact use case
    return null
  }

  async delete_contact(userId: string, contactId: string) {
    // TODO: Implement delete contact use case
    return null
  }
  // --- END TEMPLATE ---
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

  async MoveListingToOrganisation(listingId: string, organisationId: string) {
    return await this.groups_repository.runInTransaction(async session => {
      const manager = await this.groups_repository.findById(listingId)
      if (!manager) throw new NotFoundError('Listing')
      const organisationFound =
        await this.organisations_service.get_organisation_by_id(organisationId)
      if (!organisationFound) throw new NotFoundError('Organisation')
      await this.organisations_service.remove_listing_from_organisation(
        manager.organisation?.toString() as string,
        listingId,
        session
      )
      await this.organisations_service.add_listing_to_organisation(
        organisationId,
        listingId,
        session
      )
      const listing = await this.groups_repository.updateById(
        listingId,
        { organisation: organisationId },
        session
      )
      return {
        ...listing,
        organisation: {
          _id: organisationFound!._id,
          name: organisationFound!.name
        }
      }
    })
  }

  async ResetActions(userId: string) {
    return await this.groups_repository.runInTransaction(async session => {
      const lockedContacts = await this.contacts_repository.find({
        locked: true,
        locked_by: userId
      })
      if (lockedContacts.length > 0) {
        lockedContacts.forEach((locked) => {
          const contact = locked
          contact.locked = false
          contact.locked_by = undefined
          sendEventToRoom(`${locked.contact_group}-editing-room`, 'contact-unlocked', { contact })
        })
        await this.contacts_repository.update_contacts(
          { locked: true, locked_by: userId },
          {
            locked: false,
            $unset: {
              locked_by: 1
            }
          },
          session
        )
      }

      const groups_editing = await this.groups_repository.find({
        users_editing: {
          $in: userId
        }
      })

      if(groups_editing.length >= 0){
        await this.groups_repository.updateMany(
        {
          users_editing: {
            $in: userId
          }
        },
        {
          $pull: {
            users_editing: userId
          }
        }
      , session)
        
      }
    })
  }
}

export const contactUseCases = new ContactUseCases(
  contactsRepository,
  contactGroupsRepository,
  userService,
  organisationService
)
