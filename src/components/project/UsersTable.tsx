import { AppRouter } from '@/server/router'
import { ActionIcon, Menu, Table, Text } from '@mantine/core'
import { IconDots, IconUserCircle, IconUserOff } from '@tabler/icons'
import { inferProcedureOutput } from '@trpc/server'
import { format } from 'date-fns'
import { FunctionComponent } from 'react'

type Project = inferProcedureOutput<AppRouter['projects']['getProject']>

interface UsersTableProps {
  users: Project['users'] | undefined
  isProjectOwner: Project['isProjectOwner'] | undefined
  ownerId: Project['ownerId'] | undefined
}

export const UsersTable: FunctionComponent<UsersTableProps> = ({
  users,
  isProjectOwner,
  ownerId
}) => {
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
              <Menu.Item icon={<IconUserOff />} color={'red.5'}>
                Remove from project
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ))

  return (
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
  )
}
