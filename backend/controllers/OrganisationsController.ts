import expressAsyncHandler from 'express-async-handler'
import organisationService, { OrganisationService } from './../services/OrganisationService'
import { AsyncHandler } from '../types'
import { createOrganisationSchema, createOrganisationType } from '../lib/validators/zodSchemas'
// import { z } from 'zod'
import { flattenZodErrorMessage } from '../lib/utils/zodErrors'
import { RequestError } from '../lib/utils/AppErrors'
import { organisationUseCases, OrganisationUseCases } from '../use cases/OrganisationUseCases'

class OrganisationController {
  // --- TEMPLATE: Add Organisation CRUD/Feature Methods ---
  update_organisation: AsyncHandler<any, any, { organisationId: string }> = async (req, res) => {
    // TODO: Implement update organisation
    res.json({ ok: true, data: null })
  }

  delete_organisation: AsyncHandler<any, any, { organisationId: string }> = async (req, res) => {
    // TODO: Implement delete organisation
    res.json({ ok: true, data: null })
  }

  invite_member: AsyncHandler<any, any, { organisationId: string }> = async (req, res) => {
    // TODO: Implement invite member to organisation
    res.json({ ok: true, data: null })
  }

  remove_member: AsyncHandler<any, any, { organisationId: string; memberId: string }> = async (req, res) => {
    // TODO: Implement remove member from organisation
    res.json({ ok: true, data: null })
  }

  // --- END TEMPLATE ---
  service: OrganisationService
  use_case: OrganisationUseCases

  constructor(service: OrganisationService, useCase: OrganisationUseCases) {
    this.service = service
    this.use_case = useCase
  }

  create_organisation: AsyncHandler<createOrganisationType, {}> = async (req, res) => {
    let validation = createOrganisationSchema.safeParse(req?.body)
    if (!validation.success) throw new RequestError(flattenZodErrorMessage(validation.error.errors))

    const organisationExists = await this.service.get_organisation(validation.data)
    if (organisationExists) {
      throw new RequestError('Organisation Already Exists')
    }

    const newOrganisation = await this.service.create_organisation(validation.data, req.user?.id)

    res.json({ ok: true, data: newOrganisation })
  }

  get_organisations: AsyncHandler<any, any> = async (req, res) => {
    const userId = req.user?.id

    const organisations = await this.service.get_organisations_for_user(userId)

    res.json({ ok: true, data: organisations })
  }

  get_organisation: AsyncHandler<any, any, { organisationId: string }> = async (req, res) => {
    const { organisationId } = req.params

    const organisation = await this.service.get_organisation_by_id(organisationId)
    res.json({ ok: true, data: organisation })
  }

  get_members: AsyncHandler<any, any, { organisationId: string }> = async (req, res) => {
    const { organisationId } = req.params

    const organisation = await this.service.get_organisation_members_by_id(organisationId)
    res.json({ ok: true, data: organisation })
  }

  get_from_invite: AsyncHandler<any, any, { inviteCode: string }> = async (req, res) => {
    const { inviteCode } = req.params

    const organisation = await this.service.get_organisation_from_invite_code(inviteCode)
    res.json({ ok: true, data: organisation })
  }

  join_from_invite: AsyncHandler<any, any, { inviteCode: string }> = async (req, res) => {
    const { inviteCode } = req.params
    const userId = req.user?.id

    const organisation = await this.use_case.JoinOrganisationFromInvite(inviteCode, userId)
    res.json({ ok: true, data: organisation })
  }
}

export const organisationController: OrganisationController = new Proxy(
  new OrganisationController(organisationService, organisationUseCases),
  {
    get(target: OrganisationController, prop: keyof OrganisationController) {
      const obj = target[prop]

      if (typeof obj == 'function') {
        return expressAsyncHandler(obj as (req: any, res: any, next: any) => any)
      }

      return obj
    }
  }
)
