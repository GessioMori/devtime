import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import { Table, Text } from '@mantine/core'
import type { ReactElement } from 'react'

const Tasks: NextPageWithLayout = () => {
  const tasks = trpc.tasks.useQuery()

  if (!tasks.data) {
    return <div>Loading tasks...</div>
  }

  const rows = tasks.data.tasks.map((task) => (
    <tr key={task.id}>
      <td>{task.title}</td>
      <td>{task.description ?? '-'}</td>
      <td>{task.startTime.toString()}</td>
      <td>{task.endTime ? task.endTime.toString() : '-'}</td>
      <td>Buttons</td>
    </tr>
  ))

  return (
    <Table verticalSpacing={'md'} highlightOnHover={true}>
      <thead>
        <tr>
          <th>
            <Text>Title</Text>
          </th>
          <th>
            <Text>Description</Text>
          </th>
          <th>
            <Text>Start</Text>
          </th>
          <th>
            <Text>Finish</Text>
          </th>
          <th>
            <Text>Actions</Text>
          </th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

Tasks.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Tasks
