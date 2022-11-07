import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Container, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { Loading } from '../../Loading';
import { BarChart } from '../BarChart';
import { NoData } from '../utils/NoData';

type TaskDurationByUserAndMonthProps = inferProcedureInput<
  AppRouter['projectStats']['getTasksDurationByMonthAndUser']
>;

export const TaskDurationByUserAndMonth: FunctionComponent<
  TaskDurationByUserAndMonthProps
> = ({ year, projectId }) => {
  const { data, isLoading } =
    trpc.projectStats.getTasksDurationByMonthAndUser.useQuery({
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
        Number of completed tasks by month
      </Title>
      <BarChart data={data} tooltipDesc={'Tasks'} tooltipName={'Minutes'} />
    </Container>
  );
};
