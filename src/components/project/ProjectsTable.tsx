import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { ActionIcon, Anchor, Menu, Table, Text } from '@mantine/core';
import {
  IconBrandGithub,
  IconCircleX,
  IconDoorExit,
  IconDots,
  IconPencil,
  IconTerminal2
} from '@tabler/icons';
import { inferProcedureOutput } from '@trpc/server';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import { DeleteModal } from '../DeleteModal';
import { LeaveProjectModal } from './LeaveProjectModal';

type ProjectsTableProps = {
  projects: inferProcedureOutput<
    AppRouter['projects']['listPaginatedProjects']
  >['projects'];
  handleRefetch: () => void;
};

export const ProjectsTable: FunctionComponent<ProjectsTableProps> = ({
  projects,
  handleRefetch
}) => {
  const [projectIdToDelete, setProjectIdToDelete] = useState<string>('');
  const [projectIdToLeave, setProjectIdToLeave] = useState<string>('');

  const deleteProjectMutation = trpc.projects.deleteProject.useMutation();
  const leaveProjectMutation = trpc.projects.leaveProject.useMutation();

  const deleteProject = async (projectId: string) => {
    await deleteProjectMutation.mutateAsync(projectId).then(() => {
      setProjectIdToDelete('');
      handleRefetch();
    });
  };

  const leaveProject = async (projectId: string) => {
    await leaveProjectMutation.mutateAsync({ projectId }).then(() => {
      setProjectIdToLeave('');
      handleRefetch();
    });
  };

  const rows = projects.map((project) => (
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
                  onClick={() => setProjectIdToDelete(project.id)}
                >
                  Delete project
                </Menu.Item>
              </>
            ) : (
              <Menu.Item
                color={'red.5'}
                icon={<IconDoorExit />}
                onClick={() => setProjectIdToLeave(project.id)}
              >
                Leave project
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));

  return (
    <>
      <DeleteModal
        deleteFn={deleteProject}
        idToDelete={projectIdToDelete}
        setIdToDelete={setProjectIdToDelete}
        title={
          projects.find((project) => project.id === projectIdToDelete)?.title ||
          ''
        }
        isLoadingDeletion={deleteProjectMutation.isLoading}
      />

      <LeaveProjectModal
        idToLeave={projectIdToLeave}
        isLoading={leaveProjectMutation.isLoading}
        leaveFn={leaveProject}
        setIdToLeave={setProjectIdToLeave}
        title={
          projects.find((project) => project.id === projectIdToLeave)?.title ||
          ''
        }
      />

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
    </>
  );
};
