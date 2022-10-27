import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Center, Container, Loader, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { PieChart } from '../pieChart';

type TaskNumberByProjectProps = inferProcedureInput<
  AppRouter['stats']['countTasks']
>;

export const TaskNumberByProject: FunctionComponent<
  TaskNumberByProjectProps
> = ({ month, year }) => {
  const { data, isLoading } = trpc.stats.countTasks.useQuery({ month, year });

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
        <Title order={3}>There is no data for this selection.</Title>
      </Center>
    );
  }

  return (
    <Container sx={{ height: '100%' }}>
      <Title order={3} align={'center'}>
        Number of tasks by project
      </Title>
      <PieChart
        data={data}
        tooltipName="Project name"
        tooltipValue="Total tasks"
      />
    </Container>
  );
};
