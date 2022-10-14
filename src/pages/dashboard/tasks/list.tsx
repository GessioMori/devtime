import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
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
import { format } from 'date-fns'
import Link from 'next/link'

import type { ReactElement } from 'react'

const ListTasks: NextPageWithLayout = () => {
  const { data: tasks } = trpc.tasks.getTasks.useQuery()

  const rows = tasks ? (
    tasks.map((task) => (
      <tr key={task.id} style={{ whiteSpace: 'nowrap' }}>
        <td style={{ cursor: 'pointer' }}>
          <Popover position={'bottom-start'}>
            <Popover.Target>
              <Text>{task.title}</Text>
            </Popover.Target>
            <Popover.Dropdown>
              <Text>
                <span style={{ fontWeight: 'bold' }}>Description: </span>
                {task.description || 'This task has no description.'}
              </Text>
            </Popover.Dropdown>
          </Popover>
        </td>
        <td>{format(task.startTime, 'dd/MM/yyyy - HH:mm')}</td>

        <td>{task.duration || '-'}</td>
        <td>{task.project ? task.project.title : '-'}</td>
        <td>
          <Menu position={'bottom-end'}>
            <Menu.Target>
              <ActionIcon variant={'outline'}>
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown style={{ whiteSpace: 'nowrap' }}>
              <Menu.Item icon={<IconPencil />}>Edit task</Menu.Item>
              {task.projectId && (
                <Link href={`/dashboard/projects/${task.projectId}`}>
                  <Menu.Item icon={<IconTerminal2 />}>Go to project</Menu.Item>
                </Link>
              )}
              <Menu.Item icon={<IconBrandGithub />}>
                See github commit
              </Menu.Item>
              <Menu.Item color={'red.5'} icon={<IconCircleX />}>
                Delete task
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4}>
        <Center>
          <Loader color="cyan" variant="bars" />
        </Center>
      </td>
    </tr>
  )

  return (
    <Container>
      <Table
        verticalSpacing={'sm'}
        highlightOnHover={true}
        horizontalSpacing={'xs'}
      >
        <thead>
          <tr style={{ whiteSpace: 'nowrap' }}>
            <th>
              <Text>Title</Text>
            </th>
            <th>
              <Text>Start</Text>
            </th>
            <th>
              <Text>Duration (h)</Text>
            </th>
            <th>
              <Text>Project</Text>
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

ListTasks.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default ListTasks
