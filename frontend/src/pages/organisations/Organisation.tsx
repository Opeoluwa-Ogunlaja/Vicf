import { useQuery } from '@tanstack/react-query'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { get_organisation } from '@/lib/utils/requestUtils'
import Skeleton from 'react-loading-skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useOrganisationsListing from '@/hooks/useOrganisationsListing'
import BlockCard from '@/components/BlockCard'
import OrganisationMembers from './OrganisationMembers'
import { useOnline } from '@/hooks/useOnline'

const OrganisationListings = ({ organisationId }: { organisationId: string }) => {
  const organisation_managers = useOrganisationsListing(organisationId)
  return organisation_managers.map(manager => {
    return <BlockCard key={manager._id} manager={manager} />
  })
}
const Organisation = () => {
  const { isOnline } = useOnline()
  const { organisationId } = useParams()
  const [params, setParams] = useSearchParams({
    tab: 'listings'
  })

  const { data: currentOrganisation, isPending: organisationPending } = useQuery({
    queryFn: () => get_organisation(organisationId!),
    queryKey: ['organisation', organisationId],
    enabled: isOnline && Boolean(organisationId),
    staleTime: Infinity
  })

  if(!isOnline) return <Navigate to={'/home'}/>

  if (organisationPending)
    return (
      <>
        <Skeleton count={2} height={'12px'} width={'264px'} />
        <Skeleton height={'100%'} className="mt-4 rounded-t-md" />
        <section className="contacts-grid mt-10 grid gap-8 pb-10 max-sm:justify-center">
          <Skeleton className="block h-[256px]" />
          <Skeleton className="block h-[256px]" />
          <Skeleton className="block h-[256px]" />
        </section>
      </>
    )

  return (
    <>
      <section className="contents space-y-1">
        <h3 className="text-xl font-semibold lg:text-3xl">{currentOrganisation.name}</h3>
        <p className="text-neutral-400">Created on so so so... date</p>
      </section>
      <Tabs
        defaultValue={params.get('tab') ?? 'listings'}
        onValueChange={tabName =>
          setParams({
            tab: tabName
          })
        }
        className="mt-8 w-full"
      >
        <TabsList className="contacts-grid w-full justify-start gap-2 border-b border-neutral-50 bg-transparent">
          <TabsTrigger
            value="listings"
            className="rounded-b-none px-10 py-2 font-medium transition hover:bg-neutral-100 data-[state=active]:bg-neutral-100"
          >
            Listings
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="rounded-b-none px-10 py-2 font-medium transition hover:bg-neutral-100 data-[state=active]:bg-neutral-100"
          >
            Members
          </TabsTrigger>
        </TabsList>
        <TabsContent value="listings" className="contacts-grid py-4 animate-in fade-in-45">
          <OrganisationListings organisationId={currentOrganisation._id} />
        </TabsContent>
        <TabsContent value="members" className="py-4 animate-in fade-in-45">
          <OrganisationMembers creator={currentOrganisation.creator} organisationId={currentOrganisation._id} />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default Organisation
