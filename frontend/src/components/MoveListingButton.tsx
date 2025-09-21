import { FC, ReactNode, useState } from 'react'
// import { IContact } from '@/types/contacts'
// import { TrashIcon } from '@/assets/icons'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { twMerge } from 'tailwind-merge'
import { useManagerActions } from '@/hooks/useManagerActions'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from './ui/select'
import { get_organisations_for_me } from '@/lib/utils/requestUtils'
import { useUser } from '@/hooks/useUser'
import Loader from './ui/loader'
import { useTimeout } from '@/hooks/useTimeout'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import usePrevious from '@/hooks/usePrevious'


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
  const queryClient = useQueryClient()
  const [selectedOrganisation, selectOrganisation] = useState(organisation?._id || '-')
  const previousOrg = usePrevious(selectedOrganisation)

  const { data: myOrganisations, isPending: organisationPending } = useQuery({
    queryFn: get_organisations_for_me,
    queryKey: ['organisations', user?._id],
    enabled: loggedIn,
    staleTime: 1000 * 60 * 20,
  })

  const { updateManagerOrganisation, updateManagerOrganisationDisplay } = useManagerActions()

  const moveMutation = useMutation({
    mutationKey: ['move_contact_listing', listing_id, selectOrganisation],
    mutationFn: () => {
      return updateManagerOrganisation(listing_id, selectedOrganisation as string, true)
    },
    onSuccess() {
      queryClient.setQueryData(['organisations', user?._id], (currentOrgs: { contact_groupings: string[], _id: string }[]) => {
        return currentOrgs.map((org) => {
          if(org._id == selectedOrganisation){
            return {...org, contact_groupings: Array.from(new Set(org.contact_groupings).add(listing_id))}
          }
          if(previousOrg && org._id == previousOrg){
            const newGroups = new Set<string | []>(org.contact_groupings)
            newGroups.delete(listing_id)
            const arr = Array.from(newGroups)
            return {...org, contact_groupings: arr}
          }
          return org
        })
      })

      const expandedSelection = myOrganisations.find((org: {_id: string}) => {
        return org._id == selectedOrganisation
      })!

      updateManagerOrganisationDisplay(listing_id, expandedSelection._id, expandedSelection.name)


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
    await moveMutation.mutateAsync()
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
