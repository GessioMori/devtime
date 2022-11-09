import { Button, Modal, Stack, Text } from '@mantine/core';
import { IconArrowBack, IconDoorExit } from '@tabler/icons';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';

type LeaveProjectModalProps = {
  idToLeave: string;
  setIdToLeave: Dispatch<SetStateAction<string>>;
  title: string;
  isLoading: boolean;
  leaveFn: (id: string) => Promise<void>;
};

export const LeaveProjectModal: FunctionComponent<LeaveProjectModalProps> = ({
  idToLeave,
  setIdToLeave,
  title,
  isLoading,
  leaveFn
}) => {
  return (
    <Modal
      opened={!!idToLeave}
      onClose={() => setIdToLeave('')}
      withCloseButton={false}
    >
      <Stack>
        <Text inline>
          Are you sure you want to leave &quot;
          {title}
          &quot; ?
        </Text>
        <Text color={'dimmed'} inline>
          (This action can not be undone)
        </Text>
        <Stack spacing={'xs'}>
          <Button
            color={'red'}
            fullWidth
            loading={isLoading}
            onClick={() => leaveFn(idToLeave)}
            leftIcon={<IconDoorExit />}
          >
            Delete
          </Button>
          <Button
            onClick={() => setIdToLeave('')}
            leftIcon={<IconArrowBack />}
            fullWidth
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};
