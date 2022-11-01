import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Center, Container, Loader, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { BarChart } from '../BarChart';

type TaskDurationByMonthProps = inferProcedureInput<
  AppRouter['tasksStats']['getTasksDurationByMonth']
>;

export const TaskDurationByMonth: FunctionComponent<
  TaskDurationByMonthProps
> = ({ year }) => {
  const { data, isLoading } = trpc.tasksStats.getTasksDurationByMonth.useQuery({
    year
  });

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
        Minutes on tasks by month
      </Title>
      <BarChart data={data} tooltipName={'Project'} tooltipDesc={'Minutes'} />
    </Container>
  );
};
