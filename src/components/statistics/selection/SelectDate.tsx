import { Group, Select } from '@mantine/core';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';

export const monthData = [
  {
    value: '12',
    label: 'All months'
  },
  {
    value: '0',
    label: 'January'
  },
  {
    value: '1',
    label: 'February'
  },
  {
    value: '2',
    label: 'March'
  },
  {
    value: '3',
    label: 'April'
  },
  {
    value: '4',
    label: 'May'
  },
  {
    value: '5',
    label: 'June'
  },
  {
    value: '6',
    label: 'July'
  },
  {
    value: '7',
    label: 'August'
  },
  {
    value: '8',
    label: 'September'
  },
  {
    value: '9',
    label: 'October'
  },
  {
    value: '10',
    label: 'November'
  },
  {
    value: '11',
    label: 'December'
  }
];

const getYearData = () => {
  const currentYear = new Date().getFullYear();

  const yearData = [];

  for (let i = 2022; i <= currentYear; i++) {
    yearData.push({
      value: i.toString(),
      label: i.toString()
    });
  }
  return yearData;
};

export type SelectDateProps = {
  setMonth: Dispatch<SetStateAction<number>>;
  setYear: Dispatch<SetStateAction<number>>;
  month: number;
  year: number;
  showMonth?: boolean;
};

export const SelectDate: FunctionComponent<SelectDateProps> = ({
  setMonth,
  setYear,
  month,
  year,
  showMonth
}) => {
  return (
    <Group mb={'md'} position="center">
      {showMonth && (
        <Select
          data={monthData}
          value={month.toString()}
          onChange={(e) => setMonth(Number(e))}
        />
      )}
      <Select
        data={getYearData()}
        value={year.toString()}
        onChange={(e) => setYear(Number(e))}
      />
    </Group>
  );
};
