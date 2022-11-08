import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import {
  ActionIcon,
  Anchor,
  Container,
  Menu,
  Popover,
  Table,
  Text,
  Title
} from '@mantine/core';
import {
  IconBrandGithub,
  IconCircleX,
  IconDots,
  IconPencil,
  IconUserCircle
} from '@tabler/icons';
import { inferProcedureOutput } from '@trpc/server';
import { format } from 'date-fns';
import { FunctionComponent, useState } from 'react';
import { DeleteModal } from '../DeleteModal';

type ProjectTasksTableProps = {
  tasks: inferProcedureOutput<AppRouter['tasks']['getTasksByProject']>['tasks'];
  handleRefetch: () => void;
};

export const ProjectTasksTable: FunctionComponent<ProjectTasksTableProps> = ({
  tasks,
  handleRefetch
}) => {
  const deleteTaskMutation = trpc.tasks.deleteTask.useMutation();

  const [taskIdToDelete, setTaskIdToDelete] = useState<string>('');

  const deleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId).then(() => {
      setTaskIdToDelete('');
      handleRefetch();
    });
  };

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
        <td>{task.user.name}</td>
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
                  onClick={() => setTaskIdToDelete(task.id)}
                >
                  Delete task
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
        deleteFn={deleteTask}
        idToDelete={taskIdToDelete}
        setIdToDelete={setTaskIdToDelete}
        title={tasks.find((task) => task.id === taskIdToDelete)?.title || ''}
        isLoadingDeletion={deleteTaskMutation.isLoading}
      />

      {tasks.length > 0 ? (
        <Container sx={{ padding: 0 }}>
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
      ) : (
        <Title order={3} align={'center'}>
          There isn&apos;t any task in this project selection. Start a new one!
        </Title>
      )}
    </>
  );
};
