import { TaskNumberByProject } from '@/components/statistics/tasks/TaskNumberByProject';
import { Container } from '@mantine/core';

const TasksStatisticsPage = () => {
  return (
    <Container sx={{ height: '80vh' }}>
      <TaskNumberByProject />
    </Container>
  );
};

export default TasksStatisticsPage;
