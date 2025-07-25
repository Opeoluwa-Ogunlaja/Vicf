import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useUser } from '@/hooks/useUser'
import { get_organisation } from '@/lib/utils/requestUtils'
import Skeleton from 'react-loading-skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useOrganisationsListing from '@/hooks/useOrganisationsListing'
import BlockCard from '@/components/BlockCard'

const OrganisationListings = ({ organisationId }: { organisationId: string }) => {
  const organisation_managers = useOrganisationsListing(organisationId)
  return organisation_managers.map(manager => {
    return <BlockCard manager={manager} />
  })
}
const Organisation = () => {
  const { loggedIn } = useUser()
  const { organisationId } = useParams()

  const { data: currentOrganisation, isPending: organisationPending } = useQuery({
    queryFn: () => get_organisation(organisationId!),
    queryKey: ['organisation', organisationId],
    enabled: loggedIn && Boolean(organisationId),
    staleTime: Infinity
  })

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
      <Tabs defaultValue="listings" className="mt-8 w-full">
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
        <TabsContent value="listings" className="contacts-grid py-4 transition-all animate-in">
          <OrganisationListings organisationId={currentOrganisation._id} />
        </TabsContent>
        <TabsContent value="members" className="py-4 transition-all animate-in">
          Change your password here.
        </TabsContent>
      </Tabs>
    </>
  )
}

export default Organisation
