import { SelectDate } from '@/components/statistics/selection/SelectDate';
import { TaskDurationByProject } from '@/components/statistics/tasks/TaskDurationByProject';
import { TaskNumberByMonth } from '@/components/statistics/tasks/TaskNumberByMonth';
import { TaskNumberByProject } from '@/components/statistics/tasks/TaskNumberByProject';
import { Container, Select, Stack, Title } from '@mantine/core';
import { useState } from 'react';

const TasksStatisticsPage = () => {
  const [selection, setSelection] = useState<string | null>(null);

  const [month, setMonth] = useState<number>(12);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  return (
    <Container
      sx={{
        height: '80vh'
      }}
      p={0}
    >
      <Stack align={'center'} spacing={0}>
        <Select
          value={selection}
          placeholder={'Select a chart to show'}
          onChange={setSelection}
          data={[
            {
              value: 'taskNumberByProject',
              label: 'Number of tasks by project'
            },
            {
              value: 'taskDurationByProject',
              label: 'Time spent on tasks for each project'
            },
            {
              value: 'taskNumberByMonth',
              label: 'Number of tasks by month'
            }
          ]}
          my={'md'}
          sx={{ width: 'min(100%, 476px)' }}
        />
        <SelectDate
          setMonthFn={setMonth}
          setYearFn={setYear}
          month={month}
          year={year}
          showMonth={selection !== 'taskNumberByMonth'}
        />
      </Stack>

      {selection === 'taskNumberByProject' ? (
        <TaskNumberByProject month={month} year={year} />
      ) : selection === 'taskDurationByProject' ? (
        <TaskDurationByProject month={month} year={year} />
      ) : selection === 'taskNumberByMonth' ? (
        <TaskNumberByMonth year={year} />
      ) : (
        <Title order={3} align={'center'} mb={'sm'}>
          Select above some chart to display.
        </Title>
      )}
    </Container>
  );
};

export default TasksStatisticsPage;
