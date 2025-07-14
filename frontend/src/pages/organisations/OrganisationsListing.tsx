import OrganisationCard from '@/components/OrganisationCard'
import { memo } from 'react'

const OrganisationsListing = memo(
  ({ organisations }: { organisations: { name: string; _id: string }[] }) => {
    return (
      <section className="organisations-grid mt-8 grid justify-between gap-10 pb-10 max-md:justify-center">
        {organisations.map((org, i) => (
          <OrganisationCard organisation={org} key={org.name + i} />
        ))}
      </section>
    )
  }
)

export default OrganisationsListing
