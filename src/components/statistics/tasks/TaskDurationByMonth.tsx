import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Container, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { Loading } from '../../Loading';
import { BarChart } from '../BarChart';
import { NoData } from '../utils/NoData';

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
    return <Loading />;
  }

  if (!data) {
    return <NoData />;
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
