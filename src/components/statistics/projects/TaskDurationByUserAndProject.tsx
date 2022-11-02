import { AppRouter } from '@/server/router';
import { trpc } from '@/utils/trpc';
import { Center, Container, Loader, Title } from '@mantine/core';
import { inferProcedureInput } from '@trpc/server';
import { FunctionComponent } from 'react';
import { PieChart } from '../PieChart';

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
        Number of tasks by user
      </Title>
      <PieChart data={data} tooltipName="User" tooltipValue="Minutes" />
    </Container>
  );
};
