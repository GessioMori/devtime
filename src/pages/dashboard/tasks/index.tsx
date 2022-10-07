import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import {
  ActionIcon,
  Container,
  HoverCard,
  Menu,
  Table,
  Text
} from '@mantine/core'
import { IconDots } from '@tabler/icons'
import type { ReactElement } from 'react'

const Tasks: NextPageWithLayout = () => {
  const tasks = trpc.tasks.useQuery()

  if (!tasks.data) {
    return <div>Loading tasks...</div>
  }

  const rows = tasks.data.tasks.map((task) => (
    <HoverCard key={task.id} closeDelay={0} position={'bottom-start'}>
      <HoverCard.Target>
        <tr>
          <td>{task.title}</td>
          <td>{task.startTime.toString()}</td>
          <td>{task.endTime ? task.endTime.toString() : '-'}</td>
          <td>
            <Menu position={'bottom-end'}>
              <Menu.Target>
                <ActionIcon variant={'outline'}>
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>Edit task</Menu.Item>
                <Menu.Item>Go to project</Menu.Item>
                <Menu.Item>See github commit</Menu.Item>
                <Menu.Item>Delete task</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </td>
        </tr>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        {task.description && (
          <>
            <Text>
              <span style={{ fontWeight: 'bold' }}>Description: </span>
              {task.description}
            </Text>
          </>
        )}
        <Text>
          <span style={{ fontWeight: 'bold' }}>Status: </span>
          Paused
        </Text>
      </HoverCard.Dropdown>
    </HoverCard>
  ))

  return (
    <Container>
      <Table verticalSpacing={'md'} highlightOnHover={true} align={'center'}>
        <thead>
          <tr>
            <th style={{ width: '35%' }}>
              <Text>Title</Text>
            </th>
            <th style={{ width: '30%' }}>
              <Text>Start</Text>
            </th>
            <th style={{ width: '30%' }}>
              <Text>Finish</Text>
            </th>
            <th style={{ width: '5%' }}>
              <Text></Text>
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Container>
  )
}

Tasks.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tasks
