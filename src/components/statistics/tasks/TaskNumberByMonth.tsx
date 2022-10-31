import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Center, Container, Loader, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { BarChart } from '../BarChart';

type TaskNumberByMonthProps = inferProcedureInput<
  AppRouter['stats']['getTasksByMonth']
>;

export const TaskNumberByMonth: FunctionComponent<TaskNumberByMonthProps> = ({
  year
}) => {
  const { data, isLoading } = trpc.stats.getTasksByMonth.useQuery({ year });

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
        Number of tasks by month
      </Title>
      <BarChart data={data} tooltipName={'Project'} tooltipDesc={'Tasks'} />
    </Container>
  );
};
