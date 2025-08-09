import MemberCard from '@/components/MemberCard'
import { get_organisation_members } from '@/lib/utils/requestUtils'
import { IUser } from '@/types'
import { useQuery } from '@tanstack/react-query'
import Skeleton from 'react-loading-skeleton'

const OrganisationMembers = ({ organisationId }: { organisationId: string }) => {
  const { data: organisation, isPending: loadingMembers } = useQuery({
    queryKey: ['organisations', organisationId, 'members'],
    queryFn: () => get_organisation_members(organisationId)
  })

  if (loadingMembers)
    return (
      <>
        <Skeleton count={2} height={'12px'} width={'264px'} />
        <section className="members-grid mt-10 grid gap-1 pb-10 max-sm:justify-center">
          <Skeleton className="block h-[72px]" />
          <Skeleton className="block h-[72px]" />
          <Skeleton className="block h-[72px]" />
        </section>
      </>
    )

  return (
    <>
      <h3 className="text-lg font-medium">{organisation?.name}'s Members</h3>

      <section className="members-grid mt-10 grid gap-1 pb-10 max-sm:justify-center">
        {organisation.members.map((member: Partial<IUser>) => {
          return <MemberCard member={member} />
        })}
      </section>
    </>
  )
}

export default OrganisationMembers
