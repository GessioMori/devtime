import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Container, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { PieChart } from '../PieChart';
import { Loading } from '../utils/Loading';
import { NoData } from '../utils/NoData';

type TaskDurationByProjectProps = inferProcedureInput<
  AppRouter['tasksStats']['countTasksTime']
>;

export const TaskDurationByProject: FunctionComponent<
  TaskDurationByProjectProps
> = ({ month, year }) => {
  const { data, isLoading } = trpc.tasksStats.countTasksTime.useQuery({
    month,
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
        Minutes on tasks by project
      </Title>
      <PieChart
        data={data}
        tooltipName="Project name"
        tooltipValue="Total minutes"
      />
    </Container>
  );
};
