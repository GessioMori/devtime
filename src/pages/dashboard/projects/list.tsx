import { trpc } from '@/utils/trpc';
import {
  ActionIcon,
  Anchor,
  Button,
  Center,
  Container,
  Loader,
  Menu,
  Modal,
  Stack,
  Table,
  Text,
  Title
} from '@mantine/core';
import {
  IconArrowBack,
  IconBrandGithub,
  IconCircleX,
  IconDoorExit,
  IconDots,
  IconPencil,
  IconTerminal2,
  IconTrash
} from '@tabler/icons';
import { NextPage } from 'next';
import Link from 'next/link';

import { useState } from 'react';

const ListProjectsPage: NextPage = () => {
  const [projectToDelete, setProjectToDelete] = useState<string>('');
  const [projectToLeave, setProjectToLeave] = useState<string>('');

  const { data: projects, isLoading } = trpc.projects.listProjects.useQuery();

  const deleteProjectMutation = trpc.projects.deleteProject.useMutation();

  const leaveProjectMutation = trpc.projects.leaveProject.useMutation();

  const deleteProject = async (projectId: string) => {
    await deleteProjectMutation.mutateAsync(projectId).then(() => {
      setProjectToDelete('');
      projects?.splice(
        projects.findIndex((project) => projectId === project.id),
        1
      );
    });
  };

  const leaveProject = async (projectId: string) => {
    await leaveProjectMutation.mutateAsync({ projectId }).then(() => {
      setProjectToLeave('');
      projects?.splice(
        projects.findIndex((project) => projectId === project.id),
        1
      );
    });
  };

  if (isLoading) {
    return (
      <Center p={'xl'}>
        <Loader variant="bars" color={'cyan'} />
      </Center>
    );
  }

  if (projects && projects.length === 0) {
    return (
      <Title order={3} align={'center'}>
        You aren&apos;t assigned to any project. Create a new one!
      </Title>
    );
  }

  const rows = projects ? (
    projects.map((project) => (
      <tr key={project.id}>
        <td>
          <Text>{project.title}</Text>
        </td>
        <td>{project.description}</td>
        <td>
          <Menu position={'bottom-end'}>
            <Menu.Target>
              <ActionIcon variant={'outline'}>
                <IconDots />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Link href={`/dashboard/projects/${project.id}`}>
                <Menu.Item
                  icon={<IconTerminal2 />}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  See project details
                </Menu.Item>
              </Link>

              {project.githubRepoUrl && (
                <Anchor
                  underline={false}
                  href={project.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Menu.Item icon={<IconBrandGithub />}>
                    Go to Github repository
                  </Menu.Item>
                </Anchor>
              )}
              {project.isProjectOwner ? (
                <>
                  <Menu.Item icon={<IconPencil />}>Edit project</Menu.Item>
                  <Menu.Item
                    color={'red.5'}
                    icon={<IconCircleX />}
                    onClick={() => setProjectToDelete(project.id)}
                  >
                    Delete project
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item
                  color={'red.5'}
                  icon={<IconDoorExit />}
                  onClick={() => setProjectToLeave(project.id)}
                >
                  Leave project
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={3}>
        <Center>
          <Loader color="cyan" variant="bars" />
        </Center>
      </td>
    </tr>
  );

  return (
    <>
      <Modal
        opened={!!projectToDelete}
        onClose={() => setProjectToDelete('')}
        withCloseButton={false}
      >
        <Stack>
          <Text inline>
            Are you sure you want to delete &quot;
            {projectToDelete &&
              (projects?.find((project) => project.id === projectToDelete)
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
              loading={deleteProjectMutation.status === 'loading'}
              onClick={() => deleteProject(projectToDelete)}
              leftIcon={<IconTrash />}
            >
              Delete
            </Button>
            <Button
              onClick={() => setProjectToDelete('')}
              leftIcon={<IconArrowBack />}
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Modal
        opened={!!projectToLeave}
        onClose={() => setProjectToLeave('')}
        withCloseButton={false}
      >
        <Stack>
          <Text inline>
            Are you sure you want to leave &quot;
            {projectToLeave &&
              (projects?.find((project) => project.id === projectToLeave)
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
              loading={deleteProjectMutation.status === 'loading'}
              onClick={() => leaveProject(projectToLeave)}
              leftIcon={<IconDoorExit />}
            >
              Leave
            </Button>
            <Button
              onClick={() => setProjectToLeave('')}
              leftIcon={<IconArrowBack />}
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Container>
        <Table verticalSpacing={'md'} highlightOnHover={true} align={'center'}>
          <thead>
            <tr>
              <th style={{ width: '35%' }}>
                <Text>Title</Text>
              </th>
              <th style={{ width: '60%' }}>
                <Text>Description</Text>
              </th>
              <th style={{ width: '5%' }}>
                <Text></Text>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Container>
    </>
  );
};

export default ListProjectsPage;
