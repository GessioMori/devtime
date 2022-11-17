import { NotificationBox } from '@/components/NotificationBox';
import { CreateTask } from '@/components/tasks/CreateTask';
import { CurrentTask } from '@/components/tasks/CurrentTask';
import { trpc } from '@/utils/trpc';
import { Container } from '@mantine/core';
import { NextPage } from 'next';
import { useState } from 'react';

const Tasks: NextPage = () => {
  const [showNotification, setShowNotification] = useState<
    'success' | 'error' | undefined
  >(undefined);

  const { data: currentTask, refetch } = trpc.tasks.getCurrentTask.useQuery(
    undefined,
    {
      suspense: true
    }
  );

  const handleRefetch = async () => {
    refetch()
      .then(() => setShowNotification('success'))
      .catch(() => setShowNotification('error'));
  };

  if (currentTask) {
    return (
      <Container>
        <CurrentTask currentTask={currentTask} handleRefetch={handleRefetch} />
      </Container>
    );
  }

  return (
    <>
      <Container>
        <CreateTask handleRefetch={handleRefetch} />
      </Container>
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
            setShowNotification(undefined);
          }}
        />
      )}
    </>
  );
};

export default Tasks;
