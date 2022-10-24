import {
  NotificationBox,
  NotificationOptions
} from '@/components/NotificationBox'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import {
  ActionIcon,
  Center,
  Container,
  Group,
  Loader,
  Table,
  Title
} from '@mantine/core'
import { IconTrash } from '@tabler/icons'
import { useState } from 'react'

const SettingsPage: NextPageWithLayout = () => {
  const [showNotification, setShowNotification] =
    useState<NotificationOptions>(undefined)

  const { data: deniedInvites, isLoading: isLoadingInvites } =
    trpc.invites.getDeniedInvites.useQuery()

  const cancelDeniedInviteMutation =
    trpc.invites.cancelDeniedInvite.useMutation()

  const handleCancelDeniedInvitation = async (projectId: string) => {
    await cancelDeniedInviteMutation
      .mutateAsync({ projectId })
      .then(() => {
        setShowNotification('success')
        deniedInvites?.splice(
          deniedInvites.findIndex((invite) => projectId === invite.projectId),
          1
        )
      })
      .catch(() => setShowNotification('error'))
  }

  if (isLoadingInvites) {
    return (
      <Center p={'xl'}>
        <Loader variant="bars" color={'cyan'} />
      </Center>
    )
  }

  const rows =
    deniedInvites &&
    deniedInvites.map((invite) => (
      <tr key={invite.projectId}>
        <td>{invite.project.title}</td>
        <td>{invite.createdAt.toLocaleString()}</td>
        <td>
          <ActionIcon
            color={'red'}
            variant="outline"
            onClick={() => handleCancelDeniedInvitation(invite.projectId)}
          >
            <IconTrash />
          </ActionIcon>
        </td>
      </tr>
    ))

  return (
    <>
      {showNotification && (
        <NotificationBox
          title={showNotification === 'success' ? '' : 'Error!'}
          type={showNotification}
          content={
            showNotification === 'success'
              ? 'Your invitation denial has been removed, you can be invited again.'
              : 'Some error occurred, try again!'
          }
          onClose={() => {
            setShowNotification(undefined)
          }}
        />
      )}
      <Container size={960}>
        <Group sx={{ borderBottom: '1px solid #c1c2c5', marginBottom: '1rem' }}>
          <Title order={3}>Denied invites</Title>
        </Group>
        {deniedInvites && deniedInvites.length > 0 ? (
          <Table
            verticalSpacing={'sm'}
            highlightOnHover={true}
            horizontalSpacing={'xs'}
            align="center"
            style={{
              overflowX: 'auto',
              display: 'block',
              whiteSpace: 'nowrap'
            }}
          >
            <thead>
              <tr>
                <th> Title</th>
                <th>Invited at</th>
                <th style={{ width: '5%' }}></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        ) : (
          <Title order={4} align={'center'}>
            You don&apos;t have any denied invitation.
          </Title>
        )}
      </Container>
    </>
  )
}

export default SettingsPage
