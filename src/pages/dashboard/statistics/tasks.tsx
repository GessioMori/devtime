import { PieChart } from '@/components/statistics/pieChart';
import { trpc } from '@/utils/trpc';
import { Center, Container, Loader } from '@mantine/core';

const TasksStatisticsPage = () => {
  const { data, isLoading } = trpc.stats.countTasks.useQuery();

  if (isLoading || !data) {
    return (
      <Center>
        <Loader color="cyan" variant="bars" />
      </Center>
    );
  }

  console.log(data);

  return (
    <Container sx={{ height: '50vh' }}>
      <PieChart
        data={data}
        tooltipName="Project name"
        tooltipValue="Total tasks"
      />
    </Container>
  );
};

export default TasksStatisticsPage;
