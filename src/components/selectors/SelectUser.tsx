import { Select } from '@mantine/core';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';

export type SelectUserProps = {
  userId: string | null;
  setUserId: Dispatch<SetStateAction<string | null>>;
  users: {
    value: string;
    label: string;
  }[];
  userSelectStyles?: Record<string, string>;
};

export const SelectUser: FunctionComponent<SelectUserProps> = ({
  userId,
  setUserId,
  userSelectStyles,
  users
}) => {
  return (
    <Select
      onChange={setUserId}
      value={userId}
      data={[{ value: 'allUsers', label: 'All users' }, ...users]}
      sx={userSelectStyles}
    />
  );
};
