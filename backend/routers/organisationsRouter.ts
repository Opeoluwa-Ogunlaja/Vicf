import express from 'express'
import { organisationController } from '../controllers/OrganisationsController'

const organisationsRouter = express.Router()

organisationsRouter.post(
  '/create',
  organisationController.create_organisation.bind(organisationController)
)

organisationsRouter.get(
  '/me',
  organisationController.get_organisations.bind(organisationController)
)

organisationsRouter.get(
  '/:organisationId',
  organisationController.get_organisation.bind(organisationController)
)

organisationsRouter.get(
  '/:organisationId/members',
  organisationController.get_members.bind(organisationController)
)

export default organisationsRouter
