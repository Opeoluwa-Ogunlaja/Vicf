import { userInfo } from 'node:os'
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

  get_organisation_by_id: typeof organisationRepository.findById = async id => {
    return this.repository.findById(id)
  }

  get_organisations_for_user = async (userId: string) => {
    return await this.repository.findAll({
      owner: userId
    })
  }

  complete_verification = async (id: string) => {
    return this.repository.updateById(id, {
      verified: true
    })
  }
}

const organisationService = new OrganisationService(organisationRepository)

export default organisationService
