import Layout from '@/components/Layout'
import { CreateTask } from '@/components/tasks/CreateTask'
import { CurrentTask } from '@/components/tasks/CurrentTask'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import type { ReactElement } from 'react'

const Tasks: NextPageWithLayout = () => {
  const { data: currentTask, refetch } = trpc.tasks.getCurrentTask.useQuery(
    undefined,
    {
      suspense: true
    }
  )

  const handleRefetch = () => {
    refetch()
  }

  if (currentTask) {
    return (
      <CurrentTask currentTask={currentTask} handleRefetch={handleRefetch} />
    )
  }

  return <CreateTask handleRefetch={handleRefetch} />
}

Tasks.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tasks
