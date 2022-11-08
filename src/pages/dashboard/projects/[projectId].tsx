import { Loading } from '@/components/Loading';
import { Invitation } from '@/components/project/Invitation';
import { ProjectTasksSection } from '@/components/project/ProjectTasksSection';
import { UsersTable } from '@/components/project/UsersTable';
import { trpc } from '@/utils/trpc';
import {
  ActionIcon,
  Anchor,
  Container,
  Divider,
  Group,
  Space,
  Text,
  Title
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const ProjectDetailsPage: NextPage = () => {
  const router = useRouter();

  const { data: project, isLoading } = trpc.projects.getProject.useQuery(
    typeof router.query.projectId === 'string' ? router.query.projectId : '',
    {
      onError() {
        router.push('/dashboard/projects/notFound');
      },
      retry: false
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Container>
        <Group position="apart" pb={'sm'}>
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
        <Divider />
        <Space h={'md'} />
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
        <Title order={4}>Users</Title>
        <Divider />
        <Space h={'md'} />
        {project?.id && project.isProjectOwner && (
          <Invitation projectId={project?.id} />
        )}
        <UsersTable
          isProjectOwner={project?.isProjectOwner}
          ownerId={project?.ownerId}
          users={project?.users}
          projectId={project?.id || ''}
        />
        <Space h={'xl'} />
        <Title order={4}>Tasks</Title>
        <Divider />
        <Space h={'md'} />
        <ProjectTasksSection
          projectId={
            typeof router.query.projectId === 'string'
              ? router.query.projectId
              : ''
          }
          users={project?.users || []}
        />
      </Container>
    </>
  );
};

export default ProjectDetailsPage;
