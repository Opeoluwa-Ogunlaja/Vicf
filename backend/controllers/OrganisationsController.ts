import expressAsyncHandler from 'express-async-handler'
import organisationService, { OrganisationService } from './../services/OrganisationService'
import { AsyncHandler } from '../types'
import { createOrganisationSchema, createOrganisationType } from '../lib/validators/zodSchemas'
// import { z } from 'zod'
import { flattenZodErrorMessage } from '../lib/utils/zodErrors'
import { RequestError } from '../lib/utils/AppErrors'

class OrganisationController {
  service: OrganisationService

  constructor(service: OrganisationService) {
    this.service = service
  }

  create_organisation: AsyncHandler<createOrganisationType, {}> = async (req, res) => {
    let validation = createOrganisationSchema.safeParse(req?.body)
    if (!validation.success) throw new RequestError(flattenZodErrorMessage(validation.error.errors))

    const organisationExists = await this.service.get_organisation(validation.data)
    if (organisationExists) {
      throw new RequestError('Organisation Already Exists')
    }

    const newOrganisation = await this.service.create_organisation(validation.data)

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
}

export const organisationController: OrganisationController = new Proxy(
  new OrganisationController(organisationService),
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
