import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import { Button, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconApps } from '@tabler/icons'
import { ReactElement } from 'react'

const NewTask: NextPageWithLayout = () => {
  const form = useForm({
    initialValues: {
      title: '',
      description: undefined
    },

    validate: {
      title: (value) =>
        value.length < 10 ? 'Name must have at least 10 letters' : null
    }
  })

  const newTaskMutation = trpc.tasks.createTask.useMutation()

  async function createNewTask() {
    await newTaskMutation
      .mutateAsync({
        title: form.values.title,
        description: form.values.description
      })
      .then(() => form.reset())
  }

  return (
    <form onSubmit={form.onSubmit(() => createNewTask())}>
      <Stack px={'lg'}>
        <Title align={'center'}>Create a new task</Title>

        <TextInput placeholder="Task title" {...form.getInputProps('title')} />
        <TextInput placeholder="Description" {...form.getInputProps('email')} />
        <Stack align={'flex-end'}>
          <Button
            color={'cyan'}
            leftIcon={<IconApps />}
            type="submit"
            loading={newTaskMutation.status === 'loading'}
            sx={{ width: '15rem' }}
          >
            Create new task
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}

NewTask.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default NewTask
