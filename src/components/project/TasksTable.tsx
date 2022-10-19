import { AppRouter } from '@/server/router'
import { trpc } from '@/utils/trpc'
import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Menu,
  Modal,
  Popover,
  Space,
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
  IconTrash,
  IconUserCircle
} from '@tabler/icons'
import { inferProcedureOutput } from '@trpc/server'
import { format } from 'date-fns'
import { FunctionComponent, useState } from 'react'

type Tasks = inferProcedureOutput<AppRouter['projects']['getProject']>['tasks']

interface TasksTableProps {
  tasks: Tasks
}

export const TasksTable: FunctionComponent<TasksTableProps> = ({ tasks }) => {
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

  const rows =
    tasks.length > 0 &&
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
        <td>{task.taskOwnerName}</td>
        <td>
          <Menu position={'bottom-end'}>
            <Menu.Target>
              <ActionIcon variant="outline">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown style={{ whiteSpace: 'nowrap' }}>
              {task.isTaskOwner && (
                <Menu.Item icon={<IconPencil />}>Edit task</Menu.Item>
              )}
              <Menu.Item icon={<IconUserCircle />}>
                Go to user profile
              </Menu.Item>
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
              {task.isTaskOwner && (
                <Menu.Item
                  color={'red.5'}
                  icon={<IconCircleX />}
                  onClick={() => setTaskToDelete(task.id)}
                >
                  Delete task
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
        opened={!!taskToDelete}
        onClose={() => setTaskToDelete('')}
        withCloseButton={false}
      >
        <Stack>
          <Text inline>
            Are you sure you want to delete &quot;
            {taskToDelete &&
              (tasks?.find((task) => task.id === taskToDelete)?.title || '')}
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

      {tasks.length > 0 && (
        <Container sx={{ padding: 0 }}>
          <Space h={'xl'} />
          <Space h={'xl'} />
          <Title
            order={4}
            sx={{ maxWidth: '50%', borderBottom: '1px solid #c1c2c5' }}
          >
            Tasks
          </Title>
          <Space h={'md'} />
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
                  <Text>Title</Text>
                </th>
                <th>
                  <Text>Start</Text>
                </th>
                <th>
                  <Text>Duration (h)</Text>
                </th>
                <th>
                  <Text>User</Text>
                </th>
                <th style={{ width: '5%' }}>
                  <Text></Text>
                </th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </Container>
      )}
    </>
  )
}
