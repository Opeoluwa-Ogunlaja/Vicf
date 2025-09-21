import { useQuery } from '@tanstack/react-query'
import OrganisationsListing from './OrganisationsListing'
import CreateNewOrganisation from '@/components/CreateNewOrganisation'
import { get_organisations_for_me } from '@/lib/utils/requestUtils'
import { useUser } from '@/hooks/useUser'
import { useMatch, Outlet } from 'react-router-dom'
import { memo } from 'react'

const OrganisationsHome = () => {
  const { loggedIn, user } = useUser()
  const { data: myOrganisations, isLoading: loadingOrganisations } = useQuery({
    queryFn: get_organisations_for_me,
    queryKey: ['organisations', user?._id],
    enabled: loggedIn
  })
  const isWithInvite = useMatch('/organisations/invitation/:inviteCode')

  return (
    <>
      <h3 className="mb-8 text-lg font-medium max-md:text-center">
        Your Organisations{' '}
        <CreateNewOrganisation className="py-4 max-md:mt-2 max-md:w-full md:ml-4" />
      </h3>

      {loadingOrganisations ? (
        <span>Loading Organisations</span>
      ) : (
        <>
          {isWithInvite && <Outlet />}
          <OrganisationsListing organisations={myOrganisations} />
        </>
      )}
    </>
  )
}

export default memo(OrganisationsHome)
