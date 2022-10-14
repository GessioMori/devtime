import { trpc } from '@/utils/trpc'
import { Button } from '@mantine/core'
import { Project, Task } from '@prisma/client'
import { FunctionComponent } from 'react'

interface CurrentTaskProps {
  currentTask: Task & {
    project: Project | null
  }
  handleRefetch: () => void
}

export const CurrentTask: FunctionComponent<CurrentTaskProps> = ({
  currentTask,
  handleRefetch
}) => {
  const finishTaskMutation = trpc.tasks.endTask.useMutation()
  const { data } = trpc.github.getLastCommits.useQuery(
    currentTask.project?.githubRepoUrl || ''
  )

  console.log(data)

  const handleFinishTask = async () => {
    await finishTaskMutation.mutateAsync(currentTask.id).then(() => {
      handleRefetch()
    })
  }

  return <Button onClick={() => console.log(currentTask)}>END TASK</Button>
}
