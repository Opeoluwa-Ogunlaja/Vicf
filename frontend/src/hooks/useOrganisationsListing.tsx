import { useManager } from './useManager'

const useOrganisationsListing = (organisationId: string) => {
  const managers = useManager()

  return managers.filter(manager => {
    return manager.organisation?._id == organisationId
  })
}

export default useOrganisationsListing
