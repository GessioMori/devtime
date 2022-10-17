import { AppRouter } from '@/server/router'
import { useStyles } from '@/styles/theme'
import { trpc } from '@/utils/trpc'
import {
  Button,
  Center,
  Group,
  Modal,
  Select,
  Space,
  Stack,
  Text
} from '@mantine/core'
import { IconArrowBack, IconCheck } from '@tabler/icons'
import { inferProcedureOutput } from '@trpc/server'
import { format, intervalToDuration } from 'date-fns'
import { FunctionComponent, useEffect, useState } from 'react'

type currentTaskType = inferProcedureOutput<
  AppRouter['tasks']['getCurrentTask']
>

interface CurrentTaskProps {
  currentTask: NonNullable<currentTaskType>
  handleRefetch: () => void
}

export const CurrentTask: FunctionComponent<CurrentTaskProps> = ({
  currentTask,
  handleRefetch
}) => {
  const { mutateAsync: mutateTask, isLoading: isLoadingMutation } =
    trpc.tasks.finishTask.useMutation()
  const {
    data: commitsData,
    refetch,
    isLoading: isLoadingCommits
  } = trpc.github.getLastCommits.useQuery(
    currentTask.project?.githubRepoUrl || '',
    { enabled: false }
  )
  const [timer, setTimer] = useState<string>('')
  const [isFinishing, setIsFinishing] = useState<boolean>(false)
  const [isShowCommits, setIsShowCommits] = useState<boolean>(false)
  const [commitUrl, setCommitUrl] = useState<string | null>('')

  const { classes } = useStyles()

  useEffect(() => {
    const refreshClock = () => {
      const durationObj = intervalToDuration({
        end: new Date(),
        start: currentTask.startTime
      })
      if (durationObj.days === undefined || durationObj.days > 0) {
        setTimer(
          `More than ${durationObj.days} ${
            durationObj.days === 1 ? 'day' : 'days'
          }`
        )
      } else {
        const padStr = (num: number | undefined) => {
          if (!num) return '00'
          return String(num).padStart(2, '0')
        }
        const durationStr = `${padStr(durationObj.hours)}:${padStr(
          durationObj.minutes
        )}:${padStr(durationObj.seconds)}`
        setTimer(durationStr)
      }
    }
    refreshClock()
    setInterval(refreshClock, 1000)
  }, [currentTask.startTime])

  const handleShowCommits = () => {
    setIsShowCommits(true)
    refetch()
  }

  const handleFinishTask = async () => {
    await mutateTask({
      taskId: currentTask.id,
      githubCommitUrl: commitUrl || null
    }).then(() => {
      handleRefetch()
    })
  }

  return (
    <>
      <Modal
        opened={isFinishing}
        onClose={() => setIsFinishing(false)}
        withCloseButton={false}
      >
        <Stack>
          <Text>
            {currentTask.projectId
              ? 'Do you want to assing a commit to this task?'
              : 'Confirm finishing this task?'}
          </Text>

          <Stack spacing={'xs'}>
            {!isShowCommits && currentTask.projectId && (
              <Button fullWidth onClick={handleShowCommits}>
                Yes, choose a commit from project repository
              </Button>
            )}
            {isShowCommits && (
              <>
                <Select
                  allowDeselect
                  placeholder={
                    isLoadingCommits
                      ? 'Loading your commits...'
                      : 'Choose a commit'
                  }
                  onChange={setCommitUrl}
                  data={
                    commitsData
                      ? commitsData.map((commit) => {
                          const label = `${commit.message || 'No message'} (${
                            commit.name
                          } - ${format(
                            new Date(commit.date),
                            'dd/MM/yyyy - HH:mm'
                          )})`
                          return {
                            value: commit.html_url,
                            label
                          }
                        })
                      : []
                  }
                />
                <Space h={'lg'} />
              </>
            )}
            <Button
              onClick={handleFinishTask}
              loading={isLoadingMutation}
              fullWidth
              leftIcon={
                !isShowCommits && currentTask.projectId ? null : <IconCheck />
              }
            >
              {!isShowCommits && currentTask.projectId
                ? 'No, just finish the task'
                : 'Finish the task'}
            </Button>
            <Button
              onClick={() => {
                setIsFinishing(false)
                setIsShowCommits(false)
                setCommitUrl(null)
              }}
              leftIcon={<IconArrowBack />}
              color={'red'}
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Center className={classes.responsiveTimer}>
        <Text>{timer}</Text>
      </Center>
      <Stack p={'lg'} className={classes.taskInfo}>
        <Text>
          <span>Task:</span> {currentTask.title}
        </Text>
        {currentTask.description && (
          <Text>
            <span>Description:</span> {currentTask.description}
          </Text>
        )}
        {currentTask.project && (
          <Text>
            <span>Project:</span> {currentTask.project.title}
          </Text>
        )}
        <Group grow position="center">
          <Button
            sx={{ maxWidth: '20rem' }}
            onClick={() => setIsFinishing(true)}
          >
            Finish task
          </Button>
        </Group>
      </Stack>
    </>
  )
}
