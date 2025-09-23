import express from 'express'
import { authMiddleware, mustAuthSocketMiddleware } from '../lib/middleware/users/authMiddleware'
import { contactsController } from '../controllers/ContactsController'
import { socketsController } from '../controllers/SocketController'

const contactsRouter = express.Router()

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
  '/contact/:contactId',
  contactsController.update_contact.bind(contactsController)
)

contactsRouter.patch(
  '/:listingId/move-to-org',
  contactsController.move_manager.bind(contactsController)
)

contactsRouter.patch(
  '/:listingId/slug-type',
  contactsController.update_slug_type.bind(contactsController)
)

contactsRouter.get('/manager', contactsController.get_manager.bind(contactsController))

contactsRouter.get('/:listingId', contactsController.get_contact_listing.bind(contactsController))

contactsRouter.get('/:listingId/contacts', contactsController.get_contacts.bind(contactsController))

contactsRouter.get('/:listingId/download-vcf', contactsController.stream_vcf.bind(contactsController))
contactsRouter.get('/:listingId/download-csv', contactsController.stream_csv.bind(contactsController))
contactsRouter.get('/:listingId/download-xlsx', contactsController.stream_xlsx.bind(contactsController))

contactsRouter.delete(
  '/:listingId/:contactId',
  contactsController.delete_contact.bind(contactsController)
)

contactsRouter.delete(
  '/:listingId',
  contactsController.delete_contact_listing.bind(contactsController)
)

socketsController.registerHandler(
  'add-contacts',
  mustAuthSocketMiddleware,
  contactsController.socket_add_contact.bind(contactsController)
)

socketsController.registerHandler(
  'set-editing',
  mustAuthSocketMiddleware,
  contactsController.socket_set_editing_contacts.bind(contactsController)
)

socketsController.registerHandler(
  'not-editing',
  mustAuthSocketMiddleware,
  contactsController.socket_set_not_editing_contacts.bind(contactsController)
)

socketsController.registerHandler(
  'lock-contact',
  mustAuthSocketMiddleware,
  contactsController.socket_lock_contact.bind(contactsController)
)

socketsController.registerHandler(
  'unlock-contact',
  mustAuthSocketMiddleware,
  contactsController.socket_unlock_contact.bind(contactsController)
)

export default contactsRouter
