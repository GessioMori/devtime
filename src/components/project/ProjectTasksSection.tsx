import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Button, Center, Container, Space, Title } from '@mantine/core';
import { IconLoader3 } from '@tabler/icons';
import { inferProcedureOutput } from '@trpc/server';
import { FunctionComponent, useState } from 'react';
import { Loading } from '../Loading';
import { ProjectTaskFilter } from './ProjectTaskFilter';
import { ProjectTasksTable } from './ProjectTasksTable';

type UsersArrType = inferProcedureOutput<
  AppRouter['projects']['getProject']
>['users'];

type ProjectTaskArrType = inferProcedureOutput<
  AppRouter['tasks']['getTasksByProject']
>['tasks'];

type ProjectTasksSectionProps = {
  projectId: string;
  users: UsersArrType;
};

export const ProjectTasksSection: FunctionComponent<
  ProjectTasksSectionProps
> = ({ projectId, users }) => {
  const [month, setMonth] = useState<number>(12);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [userId, setUserId] = useState<string | null>('allUsers');

  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = trpc.tasks.getTasksByProject.useInfiniteQuery(
    {
      limit: 10,
      month,
      year,
      projectId,
      userId
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
      <ProjectTaskFilter
        month={month}
        year={year}
        setMonth={setMonth}
        setYear={setYear}
        users={users.map((user) => ({
          value: user.id,
          label: user.name ?? 'No username'
        }))}
        setUserId={setUserId}
        userId={userId}
      />

      <Space h={'xl'} />

      {isLoading ? (
        <Loading />
      ) : data && data.pages[0].tasks.length > 0 ? (
        <ProjectTasksTable
          tasks={data.pages.reduce<ProjectTaskArrType>(
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
