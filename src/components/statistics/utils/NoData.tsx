import { Center, Title } from '@mantine/core';
import { FunctionComponent } from 'react';

export const NoData: FunctionComponent = () => {
  return (
    <Center p={'xl'}>
      <Title order={3} align={'center'} mb={'sm'}>
        There is no data for this selection.
      </Title>
    </Center>
  );
};
