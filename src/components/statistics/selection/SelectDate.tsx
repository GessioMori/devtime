import { Group, Select } from '@mantine/core';
import { FunctionComponent } from 'react';

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

interface SelectDateProps {
  setMonthFn: (month: number) => void;
  setYearFn: (month: number) => void;
  month: number;
  year: number;
  showMonth: boolean;
}

export const SelectDate: FunctionComponent<SelectDateProps> = ({
  setMonthFn,
  setYearFn,
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
          onChange={(e) => setMonthFn(Number(e))}
        />
      )}
      <Select
        data={getYearData()}
        value={year.toString()}
        onChange={(e) => setYearFn(Number(e))}
      />
    </Group>
  );
};
