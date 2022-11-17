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
import { inferProcedureOutput } from '@trpc/server';
import { format } from 'date-fns';
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useMemo
} from 'react';
import { AppRouter } from '../../server/router';
import { trpc } from '../../utils/trpc';

type EditTaskModalProps = {
  idToEdit: string;
  setIdToEdit: Dispatch<SetStateAction<string>>;
  task: inferProcedureOutput<
    AppRouter['tasks']['getTasksByUser']
  >['tasks'][number];
  isLoading: boolean;
  editFn: (
    id: string,
    title: string,
    description: string | null | undefined,
    commitUrl: string | null | undefined
  ) => Promise<void>;
};

export const EditTaskModal: FunctionComponent<EditTaskModalProps> = ({
  idToEdit,
  setIdToEdit,
  isLoading,
  editFn,
  task: { title, description, project, githubCommitUrl }
}) => {
  const { getInputProps, onSubmit, setFieldValue } = useForm({
    initialValues: useMemo(
      () => ({
        title,
        description: description ?? '',
        githubCommitUrl
      }),
      [title, description, githubCommitUrl]
    ),

    validate: {
      title: (value) =>
        value.length < 5 ? 'Project title must have at least 5 letters' : null
    }
  });

  const {
    data: commitsData,
    refetch: refetchCommits,
    isLoading: isLoadingCommits
  } = trpc.github.getLastCommits.useQuery(project?.githubRepoUrl || '', {
    enabled: false
  });

  useEffect(() => {
    if (project) {
      refetchCommits();
    }
  }, [project, refetchCommits]);

  useEffect(() => {
    setFieldValue('title', title);
    setFieldValue('description', description ?? '');
  }, [title, description, setFieldValue]);

  useEffect(() => {
    if (commitsData) {
      const foundCommit = commitsData.find(
        (commit) => commit.html_url == githubCommitUrl
      );

      if (foundCommit) {
        setFieldValue('githubCommitUrl', foundCommit.html_url);
      } else {
        setFieldValue('githubCommitUrl', null);
      }
    }
  }, [githubCommitUrl, setFieldValue, commitsData]);

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
              values.githubCommitUrl
            )
          )}
        >
          <Text color="dimmed">Title</Text>
          <TextInput {...getInputProps('title')} />
          <Space h={'sm'} />
          <Text color="dimmed">Description</Text>
          <TextInput
            placeholder="Task description (optional)"
            {...getInputProps('description')}
          />

          {project && (
            <>
              <Space h={'sm'} />
              <Text color="dimmed">Commit</Text>
              <Select
                searchable
                clearable
                allowDeselect
                placeholder={
                  isLoadingCommits
                    ? 'Loading your commits...'
                    : 'Choose a commit (optional)'
                }
                data={
                  commitsData
                    ? commitsData.map((commit) => {
                        const label = `${commit.message || 'No message'} (${
                          commit.name
                        } - ${format(
                          new Date(commit.date),
                          'dd/MM/yyyy - HH:mm'
                        )})`;
                        return {
                          value: commit.html_url,
                          label
                        };
                      })
                    : []
                }
                {...getInputProps('githubCommitUrl')}
              />
            </>
          )}

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
