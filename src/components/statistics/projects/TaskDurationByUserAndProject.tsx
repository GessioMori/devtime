import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Container, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { Loading } from '../../Loading';
import { PieChart } from '../PieChart';
import { NoData } from '../utils/NoData';

type TaskDurationByUserAndProjectProps = inferProcedureInput<
  AppRouter['projectStats']['countTasksDurationByProject']
>;

export const TaskDurationByUserAndProject: FunctionComponent<
  TaskDurationByUserAndProjectProps
> = ({ month, year, projectId }) => {
  const { data, isLoading } =
    trpc.projectStats.countTasksDurationByProject.useQuery({
      month,
      year,
      projectId
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
        Duration of completed tasks by month
      </Title>
      <PieChart data={data} tooltipName="User" tooltipValue="Minutes" />
    </Container>
  );
};
