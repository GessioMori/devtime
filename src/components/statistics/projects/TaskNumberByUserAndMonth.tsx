import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Container, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { BarChart } from '../BarChart';
import { Loading } from '../utils/Loading';
import { NoData } from '../utils/NoData';

type TaskNumberByUserAndMonthProps = inferProcedureInput<
  AppRouter['projectStats']['getTasksByMonthAndUser']
>;

export const TaskNumberByUserAndMonth: FunctionComponent<
  TaskNumberByUserAndMonthProps
> = ({ year, projectId }) => {
  const { data, isLoading } = trpc.projectStats.getTasksByMonthAndUser.useQuery(
    {
      year,
      projectId
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return <NoData />;
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
