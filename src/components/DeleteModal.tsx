import { Button, Modal, Stack, Text } from '@mantine/core';
import { IconArrowBack, IconTrash } from '@tabler/icons';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';

type DeleteModalProps = {
  idToDelete: string;
  setIdToDelete: Dispatch<SetStateAction<string>>;
  title: string;
  isLoadingDeletion: boolean;
  deleteFn: (id: string) => Promise<void>;
};

export const DeleteModal: FunctionComponent<DeleteModalProps> = ({
  idToDelete,
  setIdToDelete,
  title,
  isLoadingDeletion,
  deleteFn
}) => {
  return (
    <Modal
      opened={!!idToDelete}
      onClose={() => setIdToDelete('')}
      withCloseButton={false}
    >
      <Stack>
        <Text inline>
          Are you sure you want to delete &quot;
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
            loading={isLoadingDeletion}
            onClick={() => deleteFn(idToDelete)}
            leftIcon={<IconTrash />}
          >
            Delete
          </Button>
          <Button
            onClick={() => setIdToDelete('')}
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
