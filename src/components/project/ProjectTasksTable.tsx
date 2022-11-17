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
import { EditTaskModal } from '../tasks/EditTaskModal';

type ProjectTasksTableProps = {
  tasks: inferProcedureOutput<AppRouter['tasks']['getTasksByProject']>['tasks'];
  handleRefetch: () => void;
};

export const ProjectTasksTable: FunctionComponent<ProjectTasksTableProps> = ({
  tasks,
  handleRefetch
}) => {
  const deleteTaskMutation = trpc.tasks.deleteTask.useMutation();
  const editTaskMutation = trpc.tasks.editTask.useMutation();

  const [taskIdToDelete, setTaskIdToDelete] = useState<string>('');
  const [taskIdToEdit, setTaskIdToEdit] = useState<string>('');

  const deleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId).then(() => {
      setTaskIdToDelete('');
      handleRefetch();
    });
  };

  const editTask = async (
    taskId: string,
    title: string,
    description: string | null | undefined,
    githubCommitUrl: string | null | undefined
  ) => {
    await editTaskMutation
      .mutateAsync({ taskId, title, description, githubCommitUrl })
      .then(() => {
        setTaskIdToEdit('');
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
                <Menu.Item
                  icon={<IconPencil />}
                  onClick={() => setTaskIdToEdit(task.id)}
                >
                  Edit task
                </Menu.Item>
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

      <EditTaskModal
        editFn={editTask}
        idToEdit={taskIdToEdit}
        isLoading={editTaskMutation.isLoading}
        setIdToEdit={setTaskIdToEdit}
        task={
          tasks.find((task) => task.id === taskIdToEdit) || {
            description: '',
            title: '',
            id: '',
            userId: '',
            project: null,
            projectId: null,
            duration: '',
            githubCommitUrl: null,
            startTime: new Date(),
            finishTime: new Date(),
            monthNumber: 0,
            yearNumber: 0,
            durationInSeconds: 0
          }
        }
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
