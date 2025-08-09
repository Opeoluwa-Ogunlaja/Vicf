import { BellIcon, DotsHorizontalIcon, UserPlusIcon, UsersOrgIcon } from '@/assets/icons'
import { FC } from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { ContactManagerEntry } from '@/types/contacts_manager'

const OrganisationCard: FC<{
  organisation: Partial<{
    name: string
    _id: string
    contact_groupings: Partial<ContactManagerEntry>[]
  }>
}> = ({ organisation }) => {
  const navigate = useNavigate()
  const handleCardClick = () => {
    navigate(`/organisations/${organisation._id}`)
  }
  return (
    <div
      onClick={handleCardClick}
      className="grid cursor-pointer overflow-clip rounded-lg border border-neutral-200/60 bg-white shadow-neutral-400/5 drop-shadow-md transition-all hover:scale-[1.05]"
    >
      <div className="flex items-center space-x-4 overflow-hidden bg-white p-4">
        <UsersOrgIcon className="mx-2 w-5 self-start justify-self-start" />
        <div className="relative flex flex-1 flex-col gap-1 text-left text-sm">
          <div className="flex items-baseline justify-between">
            <h4 className="text-lg font-semibold">{organisation.name}</h4>
            <section className="quick-organisation-buttons -mr-2/5 flex gap-2 self-stretch">
              <Button variant={'outline'} className="rounded-full p-3">
                <BellIcon />
              </Button>
              <Button variant={'outline'} className="rounded-full p-3">
                <DotsHorizontalIcon />
              </Button>
            </section>
          </div>
          <p className="flex gap-2 font-medium leading-none text-neutral-400">
            <UserPlusIcon width={'1em'} /> {organisation.contact_groupings?.length} listings
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrganisationCard
