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

export default organisationsRouter
