import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import type { ReactElement } from 'react'

const Tasks: NextPageWithLayout = () => {
  const tasks = trpc.tasks.useQuery()

  if (!tasks.data) {
    return <div>Loading tasks...</div>
  }

  return (
    <div>
      {tasks.data.tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  )
}

Tasks.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tasks
