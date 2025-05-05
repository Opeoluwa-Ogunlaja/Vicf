import express from 'express'
import { organisationController } from '../controllers/OrganisationsController'

const organisationsRouter = express.Router()

organisationsRouter.post(
  '/create',
  organisationController.create_organisation.bind(organisationController)
)

export default organisationsRouter
