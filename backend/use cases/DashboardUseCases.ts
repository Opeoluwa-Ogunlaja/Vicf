import { ContactUseCases } from './ContactUseCases'
import { OrganisationService } from '../services/OrganisationService'
import { contactUseCases } from './ContactUseCases'
import organisationService from '../services/OrganisationService'

export class DashboardUseCases {
  contactUseCases: ContactUseCases
  organisationService: OrganisationService
  constructor(contactUseCases: ContactUseCases, organisationService: OrganisationService) {
    this.contactUseCases = contactUseCases
    this.organisationService = organisationService
  }

  async getUserStats(userId: string) {
    // Example: count listings created, updated, etc.
    const listingsCreated = await this.contactUseCases.countListingsCreatedByUser(userId)
    const listingsUpdatedToDrive = await this.contactUseCases.countListingsUpdatedToDriveByUser(userId)
    // Add more stats as needed
    return {
      listingsCreated,
      listingsUpdatedToDrive
    }
  }
}

export const dashboardUseCases = new DashboardUseCases(contactUseCases, organisationService)
