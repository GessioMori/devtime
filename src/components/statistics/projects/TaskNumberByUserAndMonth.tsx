import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Center, Container, Loader, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { BarChart } from '../BarChart';

type TaskDurationByUserAndMonthProps = inferProcedureInput<
  AppRouter['projectStats']['getTasksByMonthAndUser']
>;

export const TaskDurationByUserAndMonth: FunctionComponent<
  TaskDurationByUserAndMonthProps
> = ({ year, projectId }) => {
  const { data, isLoading } = trpc.projectStats.getTasksByMonthAndUser.useQuery(
    {
      year,
      projectId
    }
  );

  if (isLoading) {
    return (
      <Center>
        <Loader color="cyan" variant="bars" />
      </Center>
    );
  }

  if (!data) {
    return (
      <Center>
        <Title order={3} align={'center'} mb={'sm'}>
          There is no data for this selection.
        </Title>
      </Center>
    );
  }

  return (
    <Container sx={{ height: '100%' }}>
      <Title order={3} align={'center'} mb={'sm'}>
        Number of completed tasks by month
      </Title>
      <BarChart data={data} tooltipDesc={'Tasks'} tooltipName={'User'} />
    </Container>
  );
};
