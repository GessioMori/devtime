import { TaskNumberByProject } from '@/components/statistics/tasks/TaskNumberByProject';
import { Container, Select, Text } from '@mantine/core';
import { useState } from 'react';

type selectionOpts = string | null;

const TasksStatisticsPage = () => {
  const [selection, setSelection] = useState<selectionOpts | null>(null);

  console.log(selection);

  return (
    <Container sx={{ height: '80vh' }}>
      <Select
        value={selection}
        placeholder={'Select a chart to show'}
        onChange={setSelection}
        data={[
          { value: 'taskNumberByProject', label: 'Number of tasks by project' },
          {
            value: 'taskTimeByProject',
            label: 'Time spent on tasks for each project'
          }
        ]}
      />
      {selection === 'taskNumberByProject' ? (
        <TaskNumberByProject />
      ) : (
        <Text>No data</Text>
      )}
    </Container>
  );
};

export default TasksStatisticsPage;
