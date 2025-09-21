import { DotsHorizontalIcon, PhonePlusIcon, UserPlusIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
import { MultiBackgroundPatterns } from './ui/BackgroundPattern'
import { BgPatternImage } from '@/assets/images'
import { FC } from 'react'
import { ContactManagerEntry } from '@/types/contacts_manager'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import ListingDeleteButton from './card-components/ListingDeleteButton'
import MoveListingButton from './MoveListingButton'
import { useUser } from '@/hooks/useUser'

const BlockCard: FC<{
  manager: Partial<ContactManagerEntry>
}> = ({ manager }) => {
  const status = manager.backed_up ? 'uploaded' : 'not-uploaded'
  const navigate = useNavigate()
  const { loggedIn } = useUser()

  return (
    <div
      className="grid origin-center relative cursor-pointer grid-rows-2 bg-white overflow-hidden rounded-lg shadow-neutral-400/5 drop-shadow-lg transition-transform hover:scale-[1.0125] md:max-w-[17.25rem]"
      style={{
        gridTemplateRows: '156px max-content'
      }}
    >
      {manager.organisation?.name && <h5 className="font-medium bg-blue-50 w-fit py-2 px-3 mb-2 rounded-full text-blue-400 absolute place-self-start z-50 ml-2 mt-5 max-w-[18ch] text-ellipsis whitespace-nowrap">{manager.organisation?.name}</h5>}
      <div className="relative isolate grid overflow-clip bg-primary" onClick={() => {navigate(`/save/${manager.url_id}`)}}>
        <div className="absolute inset-0 -z-10">
          <MultiBackgroundPatterns
            count={10}
            className="aspect-square w-20 opacity-20"
            source={BgPatternImage}
          />
        </div>
        <DropdownMenu dir="ltr" modal={true}>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant={'outline'}
              size={'icon'}
              className="pointer-events-auto z-10 m-4 h-11 w-11 justify-self-end rounded-full border-primary outline-primary hover:bg-white hover:shadow-inner"
            >
              <DotsHorizontalIcon className="w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="max-w-[256px] shadow-lg md:!translate-x-1/3"
            style={{
              minWidth: '8rem',
              width: `var(--radix-popper-anchor-width)`
            }}
          >
            <Link to={`/save/${manager.url_id}`}>
              <DropdownMenuItem className='block p-2'>Open</DropdownMenuItem>
            </Link>

            { loggedIn && <MoveListingButton listing={manager} listing_id={manager._id as string} className='block w-full h-full p-2 hover:bg-neutral-50 hover:text-neutral-600 transition-colors text-left text-sm'>
              Move
            </MoveListingButton>}
            <ListingDeleteButton listing={manager} listing_id={manager._id as string} className='block w-full h-full p-2 hover:bg-red-50 hover:text-red-400 transition-colors text-left text-sm'>
              Delete
            </ListingDeleteButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-4 overflow-hidden p-3 sm:p-4">
        <PhonePlusIcon className="mx-2 w-5 self-start pt-2" />
        <div className="flex flex-1 flex-col gap-1 text-left text-sm">
          <h4 className="text-lg font-semibold">{manager.name}</h4>
          <p className="flex gap-2 font-medium leading-none text-neutral-400">
            <UserPlusIcon width={'1em'} />{' '}
            {manager.contacts_count && manager?.contacts_count > 0 ? manager.contacts_count : 'No'}{' '}
            contacts
          </p>
          <p className={cn('mt-1 text-xs text-muted', { 'text-accent': status == 'uploaded' })}>
            {status !== 'uploaded'
              ? 'Contacts not exported or saved to drive'
              : 'Contacts saved to drive'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlockCard
