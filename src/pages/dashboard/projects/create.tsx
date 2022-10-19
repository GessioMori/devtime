import { NotificationBox } from '@/components/NotificationBox'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import { Button, Select, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconApps } from '@tabler/icons'
import { useState } from 'react'

const CreateProject: NextPageWithLayout = () => {
  const [showNotification, setShowNotification] = useState<
    'success' | 'error' | undefined
  >(undefined)

  const { data, isLoading } = trpc.github.getUserRepositories.useQuery()
  const createProjectMutation = trpc.projects.createProject.useMutation()

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      githubRepoUrl: ''
    },

    validate: {
      title: (value) =>
        value.length < 5 ? 'Project title must have at least 5 letters' : null
    }
  })

  async function createNewProject() {
    await createProjectMutation
      .mutateAsync({
        title: form.values.title,
        description: form.values.description || undefined,
        githubRepoUrl: form.values.githubRepoUrl || undefined
      })
      .then(() => {
        setShowNotification('success')
        form.reset()
      })
      .catch(() => setShowNotification('error'))
  }

  return (
    <Stack
      align={'flex-end'}
      justify={'space-between'}
      sx={{ minHeight: '100%' }}
    >
      <form
        onSubmit={form.onSubmit(() => createNewProject())}
        style={{ width: '100%' }}
      >
        <Stack px={'lg'}>
          <Title align={'center'} order={3}>
            Create a new project
          </Title>

          <TextInput
            placeholder="Project title"
            {...form.getInputProps('title')}
          />
          <TextInput
            placeholder="Description (optional)"
            {...form.getInputProps('description')}
          />
          <Select
            searchable
            clearable
            allowDeselect
            placeholder={
              isLoading
                ? 'Loading your repositories...'
                : 'Choose a repository (optional)'
            }
            data={
              data
                ? data?.repositories.map((repository) => {
                    return {
                      value: repository.url,
                      label: repository.name
                    }
                  })
                : []
            }
            {...form.getInputProps('githubRepoUrl')}
          />
          <Stack align={'flex-end'}>
            <Button
              color={'cyan'}
              leftIcon={<IconApps />}
              type="submit"
              loading={createProjectMutation.status === 'loading'}
              sx={{ width: '15rem' }}
            >
              Create new project
            </Button>
          </Stack>
        </Stack>
      </form>

      {showNotification && (
        <NotificationBox
          title={showNotification === 'success' ? 'Project created!' : 'Error!'}
          type={showNotification}
          content={
            showNotification === 'success'
              ? 'Now you can assign a task to this project!'
              : 'Some error occurred, try again!'
          }
          onClose={() => {
            setShowNotification(undefined)
          }}
        />
      )}
    </Stack>
  )
}

export default CreateProject
