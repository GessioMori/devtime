import { SelectDate } from '@/components/statistics/selection/SelectDate';
import { TaskDurationByProject } from '@/components/statistics/tasks/TaskDurationByProject';
import { TaskNumberByProject } from '@/components/statistics/tasks/TaskNumberByProject';
import { Container, Select, Text } from '@mantine/core';
import { useState } from 'react';

const TasksStatisticsPage = () => {
  const [selection, setSelection] = useState<string | null>(null);

  const [month, setMonth] = useState<number>(12);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  return (
    <Container sx={{ height: '80vh' }}>
      <Select
        value={selection}
        placeholder={'Select a chart to show'}
        onChange={setSelection}
        data={[
          { value: 'taskNumberByProject', label: 'Number of tasks by project' },
          {
            value: 'taskDurationByProject',
            label: 'Time spent on tasks for each project'
          }
        ]}
        my={'md'}
        sx={{ maxWidth: '476px' }}
      />
      <SelectDate
        setMonthFn={setMonth}
        setYearFn={setYear}
        month={month}
        year={year}
      />

      {selection === 'taskNumberByProject' ? (
        <TaskNumberByProject month={month} year={year} />
      ) : selection === 'taskDurationByProject' ? (
        <TaskDurationByProject month={month} year={year} />
      ) : (
        <Text>No data</Text>
      )}
    </Container>
  );
};

export default TasksStatisticsPage;
