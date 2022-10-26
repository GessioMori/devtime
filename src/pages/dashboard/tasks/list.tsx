import { trpc } from '@/utils/trpc'
import {
  ActionIcon,
  Anchor,
  Button,
  Center,
  Container,
  Loader,
  Menu,
  Modal,
  Popover,
  Stack,
  Table,
  Text,
  Title
} from '@mantine/core'
import {
  IconArrowBack,
  IconBrandGithub,
  IconCircleX,
  IconDots,
  IconPencil,
  IconTerminal2,
  IconTrash
} from '@tabler/icons'
import { format } from 'date-fns'
import { NextPage } from 'next'
import Link from 'next/link'
import { useState } from 'react'

const ListTasks: NextPage = () => {
  const { data: tasks, isLoading } = trpc.tasks.getTasks.useQuery()
  const deleteTaskMutation = trpc.tasks.deleteTask.useMutation()

  const [taskToDelete, setTaskToDelete] = useState<string>('')

  const deleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId).then(() => {
      setTaskToDelete('')
      tasks?.splice(
        tasks.findIndex((task) => taskId === task.id),
        1
      )
    })
  }

  if (isLoading) {
    return (
      <Center>
        <Loader color="cyan" variant="bars" />
      </Center>
    )
  }

  const rows =
    tasks &&
    tasks.map((task) => (
      <tr key={task.id} style={{ whiteSpace: 'nowrap' }}>
        <td style={{ cursor: 'pointer', whiteSpace: 'normal' }}>
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
              <ActionIcon variant="outline">
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
              {task.githubCommitUrl && (
                <Anchor
                  underline={false}
                  href={task.githubCommitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Menu.Item icon={<IconBrandGithub />}>
                    See github commit
                  </Menu.Item>
                </Anchor>
              )}

              <Menu.Item
                color={'red.5'}
                icon={<IconCircleX />}
                onClick={() => setTaskToDelete(task.id)}
              >
                Delete task
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </td>
      </tr>
    ))

  return (
    <>
      <Modal
        opened={!!taskToDelete}
        onClose={() => setTaskToDelete('')}
        withCloseButton={false}
      >
        <Stack>
          <Text inline>
            Are you sure you want to delete &quot;
            {taskToDelete &&
              (tasks?.filter((project) => project.id === taskToDelete)[0]
                ?.title ||
                '')}
            &quot; ?
          </Text>
          <Text color={'dimmed'} inline>
            (This action can not be undone)
          </Text>
          <Stack spacing={'xs'}>
            <Button
              color={'red'}
              fullWidth
              loading={deleteTaskMutation.status === 'loading'}
              onClick={() => deleteTask(taskToDelete)}
              leftIcon={<IconTrash />}
            >
              Delete
            </Button>
            <Button
              onClick={() => setTaskToDelete('')}
              leftIcon={<IconArrowBack />}
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Container size={960}>
        {tasks && tasks?.length > 0 ? (
          <Table
            verticalSpacing={'sm'}
            highlightOnHover={true}
            horizontalSpacing={'xs'}
            style={{
              display: 'block',
              overflowX: 'auto'
            }}
          >
            <thead style={{ whiteSpace: 'nowrap' }}>
              <tr>
                <th style={{ width: '40%' }}>
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
                <th style={{ width: '5%', whiteSpace: 'nowrap' }}>
                  <Text></Text>
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        ) : (
          <Title order={3} align={'center'}>
            You don&apos;t have any completed task. Start a new one!
          </Title>
        )}
      </Container>
    </>
  )
}

export default ListTasks
