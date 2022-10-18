import { Invitation } from '@/components/project/Invitation'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import {
  ActionIcon,
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Loader,
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
  IconUserCircle,
  IconUserOff
} from '@tabler/icons'
import { format } from 'date-fns'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { z } from 'zod'

const ProjectDetailsPage: NextPageWithLayout<{ projectId: string }> = ({
  projectId
}) => {
  const router = useRouter()
  const { data: project, isLoading } = trpc.projects.getProject.useQuery(
    projectId,
    {
      onError() {
        router.push('/dashboard/projects/notFound')
      },
      retry: false
    }
  )
  const deleteTaskMutation = trpc.tasks.deleteTask.useMutation()

  const [taskToDelete, setTaskToDelete] = useState<string>('')

  const deleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId).then(() => {
      setTaskToDelete('')
      project?.tasks?.splice(
        project.tasks.findIndex((task) => taskId === task.id),
        1
      )
    })
  }

  if (isLoading) {
    return (
      <Center p={'xl'}>
        <Loader variant="bars" color={'cyan'} />
      </Center>
    )
  }

  const tasksRows =
    project?.tasks &&
    project?.tasks.length > 0 &&
    project.tasks.map((task) => (
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
        <td>{task.ownerName}</td>
        <td>
          <Menu position={'bottom-end'}>
            <Menu.Target>
              <ActionIcon variant="outline">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown style={{ whiteSpace: 'nowrap' }}>
              <Menu.Item icon={<IconPencil />}>Edit task</Menu.Item>
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

  const usersRows =
    project?.users &&
    project.users.map((userInfo) => (
      <tr key={userInfo.userId} style={{ whiteSpace: 'nowrap' }}>
        <td>
          {userInfo.isOwner ? (
            <Text>
              {userInfo.user.name}{' '}
              <Text color={'dimmed'} component="span">
                (Owner)
              </Text>
            </Text>
          ) : (
            <Text>{userInfo.user.name}</Text>
          )}
        </td>
        <td>{format(userInfo.assignedAt, 'dd/MM/yyyy')}</td>
        <td>
          <Menu position={'bottom-end'}>
            <Menu.Target>
              <ActionIcon variant="outline">
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown style={{ whiteSpace: 'nowrap' }}>
              <Menu.Item icon={<IconUserCircle />}>
                Go to user profile
              </Menu.Item>
              {project.isProjectOwner && project.ownerId !== userInfo.userId && (
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
              (project?.tasks?.filter(
                (project) => project.id === taskToDelete
              )[0]?.title ||
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
      <Container>
        <Group
          position="apart"
          sx={{ borderBottom: '1px solid #c1c2c5' }}
          pb={'sm'}
        >
          <Title order={3}>{project?.title}</Title>
          {project?.githubRepoUrl && (
            <Anchor
              href={project.githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ActionIcon
                size="lg"
                variant="outline"
                aria-details="Go to Github repository"
                aria-label="Github repository"
              >
                <IconBrandGithub />
              </ActionIcon>
            </Anchor>
          )}
        </Group>
        {project?.description && (
          <>
            <Space h={'lg'} />
            <Text>
              <span style={{ fontWeight: 'bold' }}>Description: </span>
              {project.description}
            </Text>
          </>
        )}
        <Text>
          <span style={{ fontWeight: 'bold' }}>Owner: </span>
          {project?.users.filter((rel) => rel.isOwner)[0]?.user.name}
        </Text>
        <Text>
          <span style={{ fontWeight: 'bold' }}>Created at: </span>
          {project?.createdAt.toLocaleDateString()}
        </Text>
      </Container>
      <Container>
        <Space h={'xl'} />
        <Title
          order={4}
          sx={{ maxWidth: '50%', borderBottom: '1px solid #c1c2c5' }}
        >
          Users
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
          <tbody>{usersRows}</tbody>
        </Table>
      </Container>
      {project?.id && <Invitation projectId={project?.id} />}
      {project?.tasks && project.tasks.length > 0 && (
        <Container>
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
            <tbody>{tasksRows}</tbody>
          </Table>
        </Container>
      )}
    </>
  )
}

export default ProjectDetailsPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const projectId =
    typeof ctx.params?.projectId === 'string' ? ctx.params?.projectId : null

  if (!projectId) {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard/projects/notFound'
      }
    }
  }

  const checkId = z.string().cuid()

  const isIdValid = checkId.safeParse(projectId)

  if (!isIdValid.success) {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard/projects/notFound'
      }
    }
  }

  return {
    props: {
      projectId
    }
  }
}
