import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import {
  ActionIcon,
  Center,
  Container,
  Loader,
  Menu,
  Popover,
  Table,
  Text
} from '@mantine/core'
import {
  IconBrandGithub,
  IconCircleX,
  IconDots,
  IconPencil,
  IconTerminal2
} from '@tabler/icons'
import type { ReactElement } from 'react'

const Tasks: NextPageWithLayout = () => {
  const tasks = {
    data: {
      tasks: [
        { id: '1', title: 'A', description: 'B', startTime: 'C', endTime: 'D' }
      ]
    },
    isLoading: false
  }

  if (tasks.isLoading || !tasks.data) {
    return (
      <Center mt={'lg'}>
        <Loader color="cyan" size="xl" />
      </Center>
    )
  }

  const rows = tasks.data.tasks.map((task) => (
    <tr key={task.id}>
      <td style={{ cursor: 'pointer' }}>
        <Popover position={'bottom-start'}>
          <Popover.Target>
            <Text>{task.title}</Text>
          </Popover.Target>
          <Popover.Dropdown>
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
          </Popover.Dropdown>
        </Popover>
      </td>
      <td>{task.startTime}</td>
      <td>{task.endTime ? task.endTime : '-'}</td>
      <td>
        <Menu position={'bottom-end'}>
          <Menu.Target>
            <ActionIcon variant={'outline'}>
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconPencil />}>Edit task</Menu.Item>
            <Menu.Item icon={<IconTerminal2 />}>Go to project</Menu.Item>
            <Menu.Item icon={<IconBrandGithub />}>See github commit</Menu.Item>
            <Menu.Item color={'red.5'} icon={<IconCircleX />}>
              Delete task
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
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
