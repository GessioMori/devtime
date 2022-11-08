import { Collapse, Divider, Group, Stack, Title } from '@mantine/core';
import { IconTriangleInverted } from '@tabler/icons';
import { FunctionComponent, useState } from 'react';
import { SelectUser, SelectUserProps } from '../selectors/SelectUser';
import {
  SelectDate,
  SelectDateProps
} from '../statistics/selection/SelectDate';

type ProjectTaskFilterProps = Omit<
  SelectDateProps & SelectUserProps,
  'showMonth'
>;

export const ProjectTaskFilter: FunctionComponent<ProjectTaskFilterProps> = ({
  setMonth,
  setYear,
  month,
  year,
  userId,
  setUserId,
  users
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
          <SelectUser
            setUserId={setUserId}
            userId={userId}
            users={users}
            userSelectStyles={{ width: 'min(100%, 476px)' }}
          />
        </Stack>
        <Divider />
      </Collapse>
    </>
  );
};
