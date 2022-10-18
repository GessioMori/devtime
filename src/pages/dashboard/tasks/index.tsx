import { NotificationBox } from '@/components/NotificationBox'
import { CreateTask } from '@/components/tasks/CreateTask'
import { CurrentTask } from '@/components/tasks/CurrentTask'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import { Stack } from '@mantine/core'
import { useState } from 'react'

const Tasks: NextPageWithLayout = () => {
  const [showNotification, setShowNotification] = useState<
    'success' | 'error' | undefined
  >(undefined)

  const { data: currentTask, refetch } = trpc.tasks.getCurrentTask.useQuery(
    undefined,
    {
      suspense: true
    }
  )

  const handleRefetch = async () => {
    refetch()
      .then(() => setShowNotification('success'))
      .catch(() => setShowNotification('error'))
  }

  if (currentTask) {
    return (
      <CurrentTask currentTask={currentTask} handleRefetch={handleRefetch} />
    )
  }

  return (
    <Stack align={'flex-end'} justify={'space-between'} sx={{ height: '100%' }}>
      <CreateTask handleRefetch={handleRefetch} />
      <Stack px={'lg'}>
        {showNotification && (
          <NotificationBox
            title={showNotification === 'success' ? 'Task completed!' : 'Oops!'}
            type={showNotification}
            content={
              showNotification === 'success'
                ? 'You can start a new one now.'
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

export default Tasks
