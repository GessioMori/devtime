import { trpc } from '@/utils/trpc'
import { Button } from '@mantine/core'
import { Task } from '@prisma/client'
import { FunctionComponent } from 'react'

interface CurrentTaskProps {
  currentTask: Task
  handleRefetch: () => void
}

export const CurrentTask: FunctionComponent<CurrentTaskProps> = ({
  currentTask,
  handleRefetch
}) => {
  const finishTaskMutation = trpc.tasks.endTask.useMutation()

  const handleFinishTask = async () => {
    await finishTaskMutation.mutateAsync(currentTask.id).then(() => {
      handleRefetch()
    })
  }

  return <Button onClick={handleFinishTask}>END TASK</Button>
}
