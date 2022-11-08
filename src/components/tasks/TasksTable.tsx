import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { ActionIcon, Anchor, Menu, Popover, Table, Text } from '@mantine/core';
import {
  IconBrandGithub,
  IconCircleX,
  IconDots,
  IconPencil,
  IconTerminal2
} from '@tabler/icons';
import { inferProcedureOutput } from '@trpc/server';
import { format } from 'date-fns';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import { DeleteModal } from '../DeleteModal';

type TasksTableProps = {
  tasks: inferProcedureOutput<AppRouter['tasks']['getTasksByUser']>['tasks'];
  handleRefetch: () => void;
};

export const TasksTable: FunctionComponent<TasksTableProps> = ({
  tasks,
  handleRefetch
}) => {
  const [taskIdToDelete, setTaskIdToDelete] = useState<string>('');

  const deleteTaskMutation = trpc.tasks.deleteTask.useMutation();

  const deleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId).then(() => {
      setTaskIdToDelete('');
      handleRefetch();
    });
  };

  const rows = tasks.map((task) => (
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
              onClick={() => setTaskIdToDelete(task.id)}
            >
              Delete task
            </Menu.Item>
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
    </>
  );
};
