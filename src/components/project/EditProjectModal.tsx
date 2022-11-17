import {
  Button,
  Modal,
  Select,
  Space,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowBack, IconPencil } from '@tabler/icons';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useMemo
} from 'react';
import { trpc } from '../../utils/trpc';

type EditProjectModalProps = {
  idToEdit: string;
  setIdToEdit: Dispatch<SetStateAction<string>>;
  title: string;
  description?: string | null;
  githubRepoUrl?: string | null;
  isLoading: boolean;
  editFn: (
    id: string,
    title: string,
    description: string | null | undefined,
    githubRepoUrl: string | null | undefined
  ) => Promise<void>;
};

export const EditProjectModal: FunctionComponent<EditProjectModalProps> = ({
  idToEdit,
  setIdToEdit,
  isLoading,
  editFn,
  title,
  description,
  githubRepoUrl
}) => {
  const { getInputProps, onSubmit, setFieldValue } = useForm({
    initialValues: useMemo(
      () => ({
        title,
        description: description ?? '',
        githubRepoUrl
      }),
      [title, description, githubRepoUrl]
    ),

    validate: {
      title: (value) =>
        value.length < 5 ? 'Project title must have at least 5 letters' : null
    }
  });

  const { data: reposData, isLoading: isLoadingRepos } =
    trpc.github.getUserRepositories.useQuery();

  useEffect(() => {
    setFieldValue('title', title);
    setFieldValue('description', description ?? '');
  }, [title, description, setFieldValue]);

  useEffect(() => {
    if (reposData) {
      const foundRepository = reposData.repositories.find(
        (repo) => repo.url == githubRepoUrl
      );

      if (foundRepository) {
        setFieldValue('githubRepoUrl', foundRepository.url);
      } else {
        setFieldValue('githubRepoUrl', undefined);
      }
    }
  }, [githubRepoUrl, setFieldValue, reposData]);

  return (
    <Modal
      opened={!!idToEdit}
      onClose={() => setIdToEdit('')}
      withCloseButton={false}
    >
      <Stack>
        <form
          onSubmit={onSubmit((values) =>
            editFn(
              idToEdit,
              values.title,
              values.description.length === 0 ? null : values.description,
              values.githubRepoUrl
            )
          )}
        >
          <Text color="dimmed">Title</Text>
          <TextInput {...getInputProps('title')} />
          <Space h={'sm'} />
          <Text color="dimmed">Description</Text>
          <TextInput
            placeholder="Project description (optional)"
            {...getInputProps('description')}
          />
          <Space h={'sm'} />
          <Text color="dimmed">Repository</Text>
          <Select
            searchable
            clearable
            allowDeselect
            placeholder={
              isLoadingRepos
                ? 'Loading your repositories...'
                : 'Choose a repository (optional)'
            }
            data={
              reposData
                ? reposData?.repositories.map((repository) => {
                    return {
                      value: repository.url,
                      label: repository.name
                    };
                  })
                : []
            }
            {...getInputProps('githubRepoUrl')}
          />
          <Space h={'md'} />
          <Stack spacing={'xs'}>
            <Button
              color={'cyan'}
              fullWidth
              loading={isLoading}
              leftIcon={<IconPencil />}
              type="submit"
            >
              Edit
            </Button>
            <Button
              color={'red'}
              onClick={() => setIdToEdit('')}
              leftIcon={<IconArrowBack />}
              type="button"
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};
