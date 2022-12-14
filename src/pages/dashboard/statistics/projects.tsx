import { TaskDurationByUserAndMonth } from '@/components/statistics/projects/TaskDurationByUserAndMonth';
import { TaskDurationByUserAndProject } from '@/components/statistics/projects/TaskDurationByUserAndProject';
import { TaskNumberByUserAndMonth } from '@/components/statistics/projects/TaskNumberByUserAndMonth';
import { TaskNumberByUserAndProject } from '@/components/statistics/projects/TaskNumberByUserAndProject';
import { SelectDate } from '@/components/statistics/selection/SelectDate';
import { trpc } from '@/utils/trpc';
import { Container, Select, Stack, Title } from '@mantine/core';
import { useState } from 'react';

const ProjectsStatisticsPage = () => {
  const [selection, setSelection] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);

  const [month, setMonth] = useState<number>(12);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const { data: projects, isLoading } = trpc.projects.listProjects.useQuery();

  return (
    <Container
      sx={{
        height: '80vh'
      }}
      p={0}
    >
      <Stack align={'center'} spacing={0}>
        <Select
          searchable
          allowDeselect
          placeholder={
            isLoading ? 'Loading your projects...' : 'Choose a project'
          }
          onChange={setProject}
          value={project}
          data={
            projects
              ? projects
                  .map((project) => {
                    return {
                      value: project.id,
                      label: project.title
                    };
                  })
                  .sort((a, b) => a.label.localeCompare(b.label))
              : []
          }
          sx={{ width: 'min(100%, 476px)' }}
        />
        <Select
          value={selection}
          placeholder={'Select a chart to show'}
          onChange={setSelection}
          data={[
            {
              value: 'taskNumberByUser',
              label: 'Number of tasks by user'
            },
            {
              value: 'taskDurationByUser',
              label: 'Time spent on tasks by user'
            },
            {
              value: 'taskNumberByMonth',
              label: 'Number of tasks by month'
            },
            {
              value: 'taskDurationByMonth',
              label: 'Time spent on tasks by month'
            }
          ]}
          my={'md'}
          sx={{ width: 'min(100%, 476px)' }}
        />
        <SelectDate
          setMonth={setMonth}
          setYear={setYear}
          month={month}
          year={year}
          showMonth={
            selection !== 'taskNumberByMonth' &&
            selection !== 'taskDurationByMonth'
          }
        />
      </Stack>
      {project ? (
        selection === 'taskNumberByUser' ? (
          <TaskNumberByUserAndProject
            month={month}
            year={year}
            projectId={project}
          />
        ) : selection === 'taskDurationByUser' ? (
          <TaskDurationByUserAndProject
            month={month}
            year={year}
            projectId={project}
          />
        ) : selection === 'taskNumberByMonth' ? (
          <TaskNumberByUserAndMonth year={year} projectId={project} />
        ) : selection === 'taskDurationByMonth' ? (
          <TaskDurationByUserAndMonth year={year} projectId={project} />
        ) : (
          <Title order={3} align={'center'} mb={'sm'}>
            Select above some chart to display.
          </Title>
        )
      ) : (
        <Title order={3} align={'center'} mb={'sm'}>
          Select a project to plot.
        </Title>
      )}
    </Container>
  );
};

export default ProjectsStatisticsPage;
