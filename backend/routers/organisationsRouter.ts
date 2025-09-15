import express from 'express'
import { organisationController } from '../controllers/OrganisationsController'

const organisationsRouter = express.Router()

organisationsRouter.post(
  '/create',
  organisationController.create_organisation.bind(organisationController)
)

organisationsRouter.post('/join/:inviteCode', () => {})

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

organisationsRouter.get('/inviteCode/:inviteCode', organisationController.get_from_invite.bind(organisationController))

organisationsRouter.put('/inviteCode/:inviteCode', organisationController.join_from_invite.bind(organisationController))

export default organisationsRouter
