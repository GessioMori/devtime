import { Center, Loader } from '@mantine/core';
import { FunctionComponent } from 'react';

export const Loading: FunctionComponent = () => {
  return (
    <Center p={'xl'}>
      <Loader color="cyan" variant="bars" />
    </Center>
  );
};
