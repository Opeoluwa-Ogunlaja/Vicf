import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
  DialogClose
} from '@/components/ui/dialog'
import Loader from '@/components/ui/loader'
import { useToast } from '@/hooks/use-toast'
import { useUser } from '@/hooks/useUser'
import { wait } from '@/lib/utils/promiseUtils'
import {
  get_organisation_from_invite,
  join_organisation_from_invite
} from '@/lib/utils/requestUtils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { useParams, useNavigate } from 'react-router-dom'

const OrganisationInvite = () => {
  const { inviteCode } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { loggedIn, user } = useUser()
  const { toast } = useToast()
  const myOrganisations = loggedIn
    ? (queryClient.getQueryData(['organisations', user?._id]) as [
        { inviteCode: string; name: string }
      ])
    : []
  const organisationPresent = myOrganisations.findIndex(org => org.inviteCode == inviteCode)

  const invite_organisation_query = useQuery({
    queryKey: ['organisation', 'inviteCode', inviteCode],
    enabled: Boolean(loggedIn && organisationPresent < 0 && inviteCode),
    queryFn: () => get_organisation_from_invite(inviteCode!)
  })

  const join_invite_mutation = useMutation({
    mutationKey: ['join-org', inviteCode],
    mutationFn: () => join_organisation_from_invite(inviteCode!)
  })

  if (!loggedIn || organisationPresent >= 0) {
    return <Navigate to="/organisations" />
  }

  const { isPending, data: invite_organisation } = invite_organisation_query

  const { isPending: joining_org } = join_invite_mutation

  const handleJoin = async () => {
    if (loggedIn && organisationPresent < 0 && inviteCode) {
      await join_invite_mutation.mutateAsync(undefined, {
        onSuccess: (data) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryClient.setQueryData(['organisations', user?._id], (prevContent: any) => {
            return [...prevContent, data]
          })
          toast({
            title: 'Joined Organisation ',
            description: (
              <>
                `Successfully joined <b>{invite_organisation_query.data.name}</b>
              </>
            )
          })
        }
      })

      await wait(500)

      navigate('/organisations', {
        replace: true
      })
    }
  }

  return (
    <Dialog defaultOpen={true} onOpenChange={isOpen => !isOpen && navigate('/organisations')}>
      <DialogOverlay className="bg-black/10 backdrop-blur-sm backdrop-filter" />
      <DialogContent className="min-h-[350px] overflow-hidden rounded-3xl p-8 pb-2">
        {isPending ? (
          <Loader className="h-8 w-8" />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                Invitation to <strong className="text-primary">{invite_organisation.name}</strong>
              </DialogTitle>
              <DialogDescription className="mt-1 text-neutral-500">
                You have been invited to this organisation using an invitation link
              </DialogDescription>
            </DialogHeader>
            <div className="-mt-12 grid">
              <p className="text-sm text-slate-300">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possible itaque, sapiente
                similique!
              </p>
              <div>
                <h4 className="text-primary">Creator</h4>
                <div className="mt-2 flex items-start gap-4">
                  <img
                    className="inline-block aspect-square w-10 rounded-full border-2 border-neutral-50 shadow-inner"
                    src={invite_organisation.creator?.profile_photo}
                    alt={invite_organisation.creator?.name.split(' ')[0]}
                  />
                  <p className="text-md font-medium text-neutral-500">
                    {invite_organisation.creator?.name}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="items-center gap-2">
              <DialogClose>Cancel</DialogClose>
              <Button disabled={joining_org} onClick={handleJoin} className="text-white">
                Join Organisation {joining_org && <Loader className="w-3" />}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default OrganisationInvite
