import userService, { UserService } from './../services/UserService'
import { organisationRepository, OrganisationRepository } from '../repositories/OrganisationsRepository'
import { NotFoundError } from '../lib/utils/AppErrors'

export class OrganisationUseCases {
  organisations_repository: OrganisationRepository
  user_service: UserService

  constructor(
    organisationsRepository: OrganisationRepository,
    userService: UserService,
  ) {
    this.organisations_repository = organisationsRepository
    this.user_service = userService
  }

  JoinOrganisationFromInvite = async (inviteCode: string, userId: string) => {
    return await this.organisations_repository.runInTransaction(async session => {
        const organisation = await this.organisations_repository.findOne({inviteCode})
        if(!organisation) throw new NotFoundError('Organisation')
        
        const updated_organisation = await this.organisations_repository.updateById(organisation.id, {
            $push: {
                members: [userId]
            }
        }, session)

        await this.user_service.add_user_to_organisation(userId, organisation.id)

        return updated_organisation
    })
  }
}

export const organisationUseCases = new OrganisationUseCases(
  organisationRepository,
  userService
)