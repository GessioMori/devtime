import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Container, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { PieChart } from '../PieChart';
import { Loading } from '../utils/Loading';
import { NoData } from '../utils/NoData';

type TaskNumberByUserAndProjectProps = inferProcedureInput<
  AppRouter['projectStats']['countTasksByProject']
>;

export const TaskNumberByUserAndProject: FunctionComponent<
  TaskNumberByUserAndProjectProps
> = ({ month, year, projectId }) => {
  const { data, isLoading } = trpc.projectStats.countTasksByProject.useQuery({
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
        Number of tasks by user
      </Title>
      <PieChart data={data} tooltipName="User" tooltipValue="Total tasks" />
    </Container>
  );
};
