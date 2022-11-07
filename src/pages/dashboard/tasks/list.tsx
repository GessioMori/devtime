import { DeleteModal } from '@/components/DeleteModal';
import { Loading } from '@/components/Loading';

import { TaskFilter } from '@/components/tasks/TaskFilter';
import { trpc } from '@/utils/trpc';
import {
  ActionIcon,
  Anchor,
  Center,
  Container,
  Group,
  Loader,
  Menu,
  Popover,
  Space,
  Table,
  Text,
  Title
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrandGithub,
  IconCircleX,
  IconDots,
  IconPencil,
  IconTerminal2
} from '@tabler/icons';
import { format } from 'date-fns';
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';

const ListTasks: NextPage = () => {
  const [page, setPage] = useState(0);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string>('');
  const [month, setMonth] = useState<number>(12);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [projectId, setProjectId] = useState<string | null>('allProjects');

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    fetchPreviousPage,
    refetch
  } = trpc.tasks.getTasks.useInfiniteQuery(
    {
      limit: 10,
      month,
      year,
      projectId
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor
    }
  );

  const deleteTaskMutation = trpc.tasks.deleteTask.useMutation();

  const deleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId).then(() => {
      setTaskIdToDelete('');
      data?.pages[page].tasks?.splice(
        data?.pages[page].tasks.findIndex((task) => taskId === task.id),
        1
      );
      if (data?.pages[page].tasks.length === 0) {
        setPage((page) => page - 1);
        refetch();
      }
    });
  };

  const rows =
    data?.pages[page]?.tasks &&
    data?.pages[page].tasks.map((task) => (
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
        title={'TEST'}
        isLoadingDeletion={deleteTaskMutation.isLoading}
      />
      <Container size={960}>
        <TaskFilter
          month={month}
          year={year}
          projectId={projectId}
          setProjectId={setProjectId}
          setMonth={setMonth}
          setYear={setYear}
        />
        {isLoading ? (
          <Loading />
        ) : page === 0 &&
          !hasNextPage &&
          data?.pages &&
          data.pages.length < page + 2 ? null : (
          <Center>
            <Group spacing={'xl'}>
              <ActionIcon
                size={'lg'}
                onClick={() => {
                  fetchPreviousPage();
                  setPage((page) => page - 1);
                }}
                disabled={page === 0}
                variant={'outline'}
                color={'cyan'}
              >
                <IconArrowLeft size={24} />
              </ActionIcon>
              <ActionIcon
                size={'lg'}
                loading={isFetchingNextPage}
                onClick={() => {
                  fetchNextPage();
                  setPage((page) => page + 1);
                }}
                disabled={
                  !hasNextPage && data?.pages && data.pages.length < page + 2
                }
                variant={'outline'}
                color={'cyan'}
              >
                <IconArrowRight size={24} />
              </ActionIcon>
            </Group>
          </Center>
        )}

        <Space h={'xl'} />
        {data?.pages[page]?.tasks && data?.pages[page].tasks?.length > 0 ? (
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
        ) : isFetchingNextPage ? (
          <Center>
            <Loader color="cyan" variant="bars" />
          </Center>
        ) : (
          <Title order={3} align={'center'}>
            You don&apos;t have any completed task for this selection. Start a
            new one!
          </Title>
        )}
      </Container>
    </>
  );
};

export default ListTasks;
