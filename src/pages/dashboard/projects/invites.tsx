import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import { Button } from '@mantine/core'

const Invites: NextPageWithLayout = () => {
  const { data, isLoading } = trpc.invites.listReceivedInvitations.useQuery()

  const handleInvitationAnswerMutation =
    trpc.invites.handleInvitation.useMutation()

  if (isLoading) {
    return <div>LOADING</div>
  }

  const handleInvitationAnswer = async (
    inviteId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    await handleInvitationAnswerMutation
      .mutateAsync({ inviteId, status })
      .then((invite) => console.log(invite))
      .catch((err) => console.error(err))
  }

  return (
    <div>
      {data?.map((invite) => (
        <>
          <div>{invite.project.title}</div>
          <div>{invite.project.description}</div>
          <div>{invite.createdAt.toLocaleString()}</div>
          <Button
            onClick={() => handleInvitationAnswer(invite.id, 'ACCEPTED')}
            loading={handleInvitationAnswerMutation.isLoading}
          >
            ACCEPT
          </Button>
          <Button onClick={() => handleInvitationAnswer(invite.id, 'REJECTED')}>
            REJECT
          </Button>
        </>
      ))}
    </div>
  )
}

export default Invites
