import { AppRouter } from '@/server/router'
import { trpc } from '@/utils/trpc'
import {
  ActionIcon,
  Button,
  Menu,
  Modal,
  Stack,
  Table,
  Text
} from '@mantine/core'
import {
  IconArrowBack,
  IconDots,
  IconUserCircle,
  IconUserOff
} from '@tabler/icons'
import { inferProcedureOutput } from '@trpc/server'
import { format } from 'date-fns'
import { FunctionComponent, useState } from 'react'

type Project = inferProcedureOutput<AppRouter['projects']['getProject']>

interface UsersTableProps {
  users: Project['users'] | undefined
  isProjectOwner: Project['isProjectOwner'] | undefined
  ownerId: Project['ownerId'] | undefined
  projectId: Project['id']
}

export const UsersTable: FunctionComponent<UsersTableProps> = ({
  users,
  isProjectOwner,
  ownerId,
  projectId
}) => {
  const [userToRemove, setUserToRemove] = useState<string>('')

  const removeUserMutation = trpc.projects.removeUserFromProject.useMutation()

  const handleRemoveUser = async (userId: string) => {
    await removeUserMutation.mutateAsync({ projectId, userId }).then(() => {
      setUserToRemove('')
      users?.splice(
        users.findIndex((user) => userId === user.id),
        1
      )
    })
  }

  const rows = users?.map((user) => (
    <tr key={user.id} style={{ whiteSpace: 'nowrap' }}>
      <td>
        {user.isProjectOwner ? (
          <Text>
            {user.name}{' '}
            <Text color={'dimmed'} component="span">
              (Owner)
            </Text>
          </Text>
        ) : (
          <Text>{user.name}</Text>
        )}
      </td>
      <td>{format(user.asignedAt, 'dd/MM/yyyy')}</td>
      <td>
        <Menu position={'bottom-end'}>
          <Menu.Target>
            <ActionIcon variant="outline">
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown style={{ whiteSpace: 'nowrap' }}>
            <Menu.Item icon={<IconUserCircle />}>Go to user profile</Menu.Item>
            {isProjectOwner && ownerId !== user.id && (
              <Menu.Item
                icon={<IconUserOff />}
                color={'red.5'}
                onClick={() => setUserToRemove(user.id)}
              >
                Remove from project
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ))

  return (
    <>
      <Modal
        opened={!!userToRemove}
        onClose={() => setUserToRemove('')}
        withCloseButton={false}
      >
        <Stack>
          <Text inline>
            Are you sure you want to remove &quot;
            {userToRemove &&
              (users?.find((user) => user.id === userToRemove)?.name || '')}
            &quot; ?
          </Text>
          <Text color={'dimmed'} inline>
            (This action can not be undone)
          </Text>
          <Stack spacing={'xs'}>
            <Button
              color={'red'}
              fullWidth
              loading={removeUserMutation.status === 'loading'}
              onClick={() => handleRemoveUser(userToRemove)}
              leftIcon={<IconUserOff />}
            >
              Yes, remove this user
            </Button>
            <Button
              onClick={() => setUserToRemove('')}
              leftIcon={<IconArrowBack />}
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Table
        verticalSpacing={'sm'}
        highlightOnHover={true}
        horizontalSpacing={'xs'}
        style={{
          display: 'block',
          whiteSpace: 'nowrap',
          overflowX: 'auto'
        }}
      >
        <thead>
          <tr style={{ whiteSpace: 'nowrap' }}>
            <th>
              <Text>Name</Text>
            </th>
            <th>
              <Text>Started at</Text>
            </th>
            <th style={{ width: '5%' }}>
              <Text></Text>
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  )
}
