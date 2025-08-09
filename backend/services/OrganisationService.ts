import {
  OrganisationRepository,
  organisationRepository
} from '../repositories/OrganisationsRepository'
import { IOrganisation } from '../types'

export class OrganisationService {
  repository: OrganisationRepository
  constructor(repository: OrganisationRepository) {
    this.repository = repository
  }

  async create_organisation(organisation: Partial<IOrganisation>) {
    return await this.repository.create(organisation as IOrganisation)
  }

  get_organisation: typeof organisationRepository.findOne = async query => {
    return this.repository.findOne(query)
  }

  get_organisation_by_id = async (id: string) => {
    return this.repository.getOrganisationWithListings(id)
  }

  get_organisations_for_user = async (userId: string) => {
    return await this.repository.findAll({
      owner: userId
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
}

const organisationService = new OrganisationService(organisationRepository)

export default organisationService
