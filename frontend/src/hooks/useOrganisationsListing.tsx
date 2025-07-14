import { useManager } from './useManager'

const useOrganisationsListing = (organisationId: string) => {
  const managers = useManager()

  return managers.filter(manager => {
    return manager.organisation == organisationId
  })
}

export default useOrganisationsListing
