import Layout from '@/components/Layout'
import { NotificationBox } from '@/components/NotificationBox'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import { Repository } from '@/utils/types'
import { Button, Select, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconApps } from '@tabler/icons'
import { ReactElement, useState } from 'react'

interface CreateProjectProps {
  repositories: Repository[]
}

const CreateProject: NextPageWithLayout = () => {
  const [showNotification, setShowNotification] = useState<
    'success' | 'error' | undefined
  >(undefined)

  const { data } = trpc.github.getUserRepositories.useQuery()
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
    <Stack align={'flex-end'} justify={'space-between'} sx={{ height: '100%' }}>
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
            placeholder="Description"
            {...form.getInputProps('description')}
          />
          <Select
            searchable
            clearable
            allowDeselect
            placeholder="Github repository"
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
              variant="light"
            >
              Create new project
            </Button>
          </Stack>
        </Stack>
      </form>
      <Stack px={'lg'}>
        {showNotification && (
          <NotificationBox
            title={
              showNotification === 'success' ? 'Project created!' : 'Error!'
            }
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
    </Stack>
  )
}

CreateProject.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CreateProject
