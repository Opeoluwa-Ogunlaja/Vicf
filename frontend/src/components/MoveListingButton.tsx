import { FC, ReactNode, useState } from 'react'
// import { IContact } from '@/types/contacts'
// import { TrashIcon } from '@/assets/icons'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { twMerge } from 'tailwind-merge'
import { useManagerActions } from '@/hooks/useManagerActions'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from './ui/select'
import { get_organisations_for_me } from '@/lib/utils/requestUtils'
import { useUser } from '@/hooks/useUser'
import Loader from './ui/loader'
import { useTimeout } from '@/hooks/useTimeout'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'


const MoveListingButton: FC<{
  listing: Partial<ContactManagerEntry>
  className?: string
  listing_id: string
  children: ReactNode
}> = props => {
  const { name, organisation } = props.listing
  const [selectOpen, setSelectOpen] = useState(false)
  const listing_id = props.listing_id
  const { toast } = useToast()
  const { loggedIn, user } = useUser()
  const [selectedOrganisation, selectOrganisation] = useState(organisation?._id || '-')

  const { data: myOrganisations, isPending: organisationPending } = useQuery({
    queryFn: get_organisations_for_me,
    queryKey: ['organisation', user?._id],
    enabled: loggedIn,
    staleTime: Infinity,
  })

  const { updateManagerOrganisation } = useManagerActions()

  const moveMutation = useMutation({
    mutationKey: ['move_contact_listing', listing_id, selectOrganisation],
    mutationFn: () => {
      return updateManagerOrganisation(listing_id, selectedOrganisation as string, true)
    },
    onSuccess() {
      toast({
        title: 'Listing Moved',
        description: (
          <>
            `Moved <b>{name}</b>
          </>
        )
      })
    },
    retry: 0
  })

  const { isPending: moving } = moveMutation
  
  const [reset] = useTimeout(() => {
    setSelectOpen(false)
  }, 3000 , false, [setSelectOpen])

  useUpdateEffect(() => {
    reset()
  },[selectedOrganisation])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOrganisationSelection = async (orgId: any) => {
    selectOrganisation(orgId)
    if(orgId == '-') return
    moveMutation.mutate()
  }

  return (
    <Select
      open={selectOpen}
      onOpenChange={(isOpen) => !moving && setSelectOpen(isOpen)}
      value={selectedOrganisation}
      onValueChange={handleOrganisationSelection}
    >
      <SelectTrigger
        onClick={e => {
          e.stopPropagation()
        }}
        className={twMerge(
          '-pb-1 bg-clip-padding flex space-between border-0 outline-0 focus:border-neutral-100 text-neutral-600 transition-colors',
          props.className
        )}
      >
        <div>{props.children}</div>
      </SelectTrigger>
      <SelectContent align='end' side='right' className="grid text-sm min-w-[200px]" onClick={e => e.stopPropagation()}>
        <h2>Move</h2>
        { organisationPending ? <Loader className="w-6 h-6"/> : 
          <SelectGroup>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              <SelectItem onClick={(e: any) => e.stopPropagation()} className='p-2' value={'-'}>--</SelectItem>
            }
            {myOrganisations.map((org: { name: string, _id: string }) => {
              return <SelectItem key={org._id} onClick={(e) => e.stopPropagation()} className='p-2' value={org._id}>{org.name}</SelectItem>
            })}
          </SelectGroup>
        }
      </SelectContent>
    </Select>
  )
}

export default MoveListingButton
