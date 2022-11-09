import { Loading } from '@/components/Loading';
import { ProjectsTable } from '@/components/project/ProjectsTable';
import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Button, Center, Container, Space, Title } from '@mantine/core';
import { IconLoader3 } from '@tabler/icons';
import { inferProcedureOutput } from '@trpc/server';
import { NextPage } from 'next';

type ProjectArrType = inferProcedureOutput<
  AppRouter['projects']['listPaginatedProjects']
>['projects'];

const ListProjectsPage: NextPage = () => {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch
  } = trpc.projects.listPaginatedProjects.useInfiniteQuery(
    {
      limit: 10
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
      {isLoading ? (
        <Loading />
      ) : data && data.pages[0].projects.length > 0 ? (
        <ProjectsTable
          projects={data.pages.reduce<ProjectArrType>(
            (acc, cur) => [...acc, ...cur.projects],
            []
          )}
          handleRefetch={handleRefetch}
        />
      ) : (
        <Title order={3} align={'center'}>
          You are&apos;t assigned to any project. Start a new one!
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

export default ListProjectsPage;
