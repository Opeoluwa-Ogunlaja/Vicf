import express from 'express'
import { authMiddleware, mustAuthSocketMiddleware } from '../lib/middleware/users/authMiddleware'
import { contactsController } from '../controllers/ContactsController'
import { socketsController } from '../controllers/SocketController'

const contactsRouter = express.Router()

contactsRouter.use(authMiddleware)

contactsRouter.post('/create', contactsController.create_group.bind(contactsController))

contactsRouter.patch(
  '/backup-input/:listingId',
  contactsController.update_input_backup.bind(contactsController)
)
contactsRouter.patch(
  '/:listingId/name',
  contactsController.update_listing_name.bind(contactsController)
)

contactsRouter.patch(
  '/:listingId/slug-type',
  contactsController.update_slug_type.bind(contactsController)
)

contactsRouter.get('/manager', contactsController.get_manager.bind(contactsController))

contactsRouter.get('/:listingId', contactsController.get_contact_listing.bind(contactsController))

contactsRouter.get('/:listingId/contacts', contactsController.get_contacts.bind(contactsController))

contactsRouter.delete(
  '/:listingId/:contactId',
  contactsController.delete_contact.bind(contactsController)
)

socketsController.registerHandler(
  'add-contacts',
  mustAuthSocketMiddleware,
  contactsController.socket_add_contact.bind(contactsController)
)

export default contactsRouter
