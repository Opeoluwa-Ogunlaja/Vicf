import { ClientSession } from 'mongoose'
import {
  OrganisationRepository,
  organisationRepository
} from '../repositories/OrganisationsRepository'
import { IOrganisation } from '../types'

export class OrganisationService {
  // --- TEMPLATE: Add OrganisationService Methods ---
  async update_organisation(organisationId: string, data: Partial<IOrganisation>) {
    // TODO: Implement update organisation
    return null
  }

  async delete_organisation(organisationId: string) {
    // TODO: Implement delete organisation
    return null
  }

  async invite_member(organisationId: string, memberId: string) {
    // TODO: Implement invite member
    return null
  }

  async remove_member(organisationId: string, memberId: string) {
    // TODO: Implement remove member
    return null
  }
  // --- END TEMPLATE ---
  repository: OrganisationRepository
  constructor(repository: OrganisationRepository) {
    this.repository = repository
  }

  async create_organisation(organisation: Partial<IOrganisation>, userId: string) {
    return await this.repository.create({...organisation, members: [userId], creator: userId} as IOrganisation)
  }

  get_organisation: typeof organisationRepository.findOne = async query => {
    return this.repository.findOne(query)
  }

  get_organisation_by_id = async (id: string) => {
    return this.repository.getOrganisationWithListings(id)
  }

  get_organisation_from_invite_code = async (inviteCode: string) => {
    const org = await this.repository.getModel().findOne({ inviteCode }).populate({ path: 'creator', select: 'name profile_photo' })
    return org
  }

  get_organisations_for_user = async (userId: string) => {
    return await this.repository.findAll({
      members: { $in: [userId] }
    })
  }

  get_organisation_members_by_id = async (organisationId: string) => {
    return await this.repository.dal
      .getModel()
      .findById(organisationId)
      .populate({
        path: 'members',
        select: 'name email profile_photo'
      })
      .select('name members')
  }

  verify_organisation_member = async (
    organisationId: string,
    userId: string,
    organisation: any
  ) => {
    if (organisation && organisation.members.includes(userId)) {
      return true
    } else {
      const organisationFound = await this.repository.findOne({
        _id: organisationId,
        members: {
          $in: userId
        }
      })

      return Boolean(organisationFound)
    }
  }

  complete_verification = async (id: string) => {
    return this.repository.updateById(id, {
      verified: true
    })
  }

  add_listing_to_organisation = async (organisationId: string, listingId: string, session?: ClientSession) => {
    return await this.repository.updateById(organisationId, {
      $addToSet: {
        contact_groupings: listingId
      }
    }, session)
  }

  remove_listing_from_organisation = async (organisationId: string, listingId: string, session?: ClientSession) => {
    return await this.repository.updateById(organisationId, {
      $pull: {
        contact_groupings: listingId
      }
    }, session)
  }
}

const organisationService = new OrganisationService(organisationRepository)

export default organisationService
