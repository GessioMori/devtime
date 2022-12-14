import { Loading } from '@/components/Loading';

import { TaskFilter } from '@/components/tasks/TaskFilter';
import { TasksTable } from '@/components/tasks/TasksTable';
import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Button, Center, Container, Space, Title } from '@mantine/core';
import { IconLoader3 } from '@tabler/icons';
import { inferProcedureOutput } from '@trpc/server';
import { NextPage } from 'next';
import { useState } from 'react';

type TaskArrType = inferProcedureOutput<
  AppRouter['tasks']['getTasksByUser']
>['tasks'];

const ListTasks: NextPage = () => {
  const [month, setMonth] = useState<number>(12);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [projectId, setProjectId] = useState<string | null>('allProjects');

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = trpc.tasks.getTasksByUser.useInfiniteQuery(
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

  const handleRefetch = () => {
    refetch();
  };

  return (
    <Container size={960} sx={{ flexDirection: 'column' }}>
      <TaskFilter
        month={month}
        year={year}
        projectId={projectId}
        setProjectId={setProjectId}
        setMonth={setMonth}
        setYear={setYear}
      />

      <Space h={'xl'} />

      {isLoading ? (
        <Loading />
      ) : data && data.pages[0].tasks.length > 0 ? (
        <TasksTable
          tasks={data.pages.reduce<TaskArrType>(
            (acc, cur) => [...acc, ...cur.tasks],
            []
          )}
          handleRefetch={handleRefetch}
        />
      ) : (
        <Title order={3} align={'center'}>
          You don&apos;t have any completed task for this selection. Start a new
          one!
        </Title>
      )}

      <Space h={'xl'} />

      {hasNextPage && (
        <Center>
          <Button
            leftIcon={<IconLoader3 />}
            onClick={() => fetchNextPage()}
            loading={isFetchingNextPage}
          >
            Load more
          </Button>
        </Center>
      )}
    </Container>
  );
};

export default ListTasks;
