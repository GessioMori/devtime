import { Collapse, Divider, Group, Stack, Title } from '@mantine/core';
import { IconTriangleInverted } from '@tabler/icons';
import { FunctionComponent, useState } from 'react';
import { SelectProject, SelectProjectProps } from '../selectors/SelectProject';
import {
  SelectDate,
  SelectDateProps
} from '../statistics/selection/SelectDate';

type TaskFilterProps = Omit<
  SelectProjectProps & SelectDateProps,
  'showMonth' | 'projectSelectStyles'
>;

export const TaskFilter: FunctionComponent<TaskFilterProps> = ({
  setMonth,
  setYear,
  month,
  year,
  projectId,
  setProjectId
}) => {
  const [filterActive, setFilterActive] = useState(false);

  return (
    <>
      <Group
        sx={{ cursor: 'pointer' }}
        position={'apart'}
        align={'center'}
        onClick={() => {
          setFilterActive((current) => !current);
        }}
      >
        <Title order={4}> Set filters </Title>
        <IconTriangleInverted size={12} />
      </Group>
      <Divider />
      <Collapse in={filterActive}>
        <Stack align={'center'} spacing={0} py={'md'}>
          <SelectDate
            setMonth={setMonth}
            setYear={setYear}
            month={month}
            year={year}
            showMonth={true}
          />
          <SelectProject
            projectId={projectId}
            setProjectId={setProjectId}
            projectSelectStyles={{ width: 'min(100%, 476px)' }}
          />
        </Stack>
        <Divider />
      </Collapse>
    </>
  );
};
