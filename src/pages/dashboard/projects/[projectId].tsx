import { Invitation } from '@/components/project/Invitation'
import { TasksTable } from '@/components/project/TasksTable'
import { UsersTable } from '@/components/project/UsersTable'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import {
  ActionIcon,
  Anchor,
  Center,
  Container,
  Group,
  Loader,
  Space,
  Text,
  Title
} from '@mantine/core'
import { IconBrandGithub } from '@tabler/icons'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
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

  if (isLoading) {
    return (
      <Center p={'xl'}>
        <Loader variant="bars" color={'cyan'} />
      </Center>
    )
  }

  return (
    <>
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
          {project?.users.find((user) => user.isProjectOwner)?.name}
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
        {project?.id && project.isProjectOwner && (
          <Invitation projectId={project?.id} />
        )}
        <UsersTable
          isProjectOwner={project?.isProjectOwner}
          ownerId={project?.ownerId}
          users={project?.users}
        />
        {project?.tasks && project?.tasks.length > 0 && (
          <TasksTable tasks={project.tasks} />
        )}
      </Container>
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
