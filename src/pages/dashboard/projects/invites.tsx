import { NotificationBox } from '@/components/NotificationBox';
import { trpc } from '@/utils/trpc';
import {
  ActionIcon,
  Center,
  Group,
  Loader,
  Table,
  Text,
  Title
} from '@mantine/core';
import { IconTerminal2, IconThumbDown, IconThumbUp } from '@tabler/icons';
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';

const Invites: NextPage = () => {
  const [showNotification, setShowNotification] = useState<
    'success' | 'error' | undefined
  >(undefined);
  const [option, setOption] = useState<'ACCEPTED' | 'REJECTED'>('ACCEPTED');

  const { data: invites, isLoading } =
    trpc.invites.listReceivedInvitations.useQuery();

  const handleInvitationAnswerMutation =
    trpc.invites.handleInvitation.useMutation();

  if (isLoading) {
    return (
      <Center p={'xl'}>
        <Loader variant="bars" color={'cyan'} />
      </Center>
    );
  }

  const handleInvitationAnswer = async (
    projectId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    await handleInvitationAnswerMutation
      .mutateAsync({ projectId, status })
      .then(() => {
        setShowNotification('success');
      })
      .catch(() => {
        setShowNotification('error');
      })
      .finally(() => {
        invites?.splice(
          invites.findIndex((invite) => projectId === invite.projectId),
          1
        );
      });
  };

  const rows = invites?.map((invite) => (
    <tr key={invite.projectId}>
      <td>{invite.project.title}</td>
      <td>{invite.createdAt.toLocaleString()}</td>

      <td>
        <Group noWrap position="right">
          <ActionIcon
            onClick={() => {
              setOption('ACCEPTED');
              handleInvitationAnswer(invite.projectId, 'ACCEPTED');
            }}
            loading={handleInvitationAnswerMutation.isLoading}
            size="xl"
            variant="outline"
            color={'cyan'}
          >
            <IconThumbUp />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              setOption('REJECTED');
              handleInvitationAnswer(invite.projectId, 'REJECTED');
            }}
            loading={handleInvitationAnswerMutation.isLoading}
            color="red"
            size="xl"
            variant="outline"
          >
            <IconThumbDown />
          </ActionIcon>
          <Link
            href={`/dashboard/projects/${invite.projectId}`}
            aria-details="Go to"
          >
            <ActionIcon color="gray" size="xl" variant="outline">
              <IconTerminal2 />
            </ActionIcon>
          </Link>
        </Group>
      </td>
    </tr>
  ));

  return (
    <>
      {invites && invites.length === 0 ? (
        <Title order={3} align={'center'}>
          You don&apos;t have project invites.
        </Title>
      ) : (
        <Group grow position="center">
          <Group
            grow
            style={{
              whiteSpace: 'nowrap',
              overflowX: 'auto',
              maxWidth: '920px'
            }}
          >
            <Table
              verticalSpacing={'sm'}
              highlightOnHover={true}
              align={'center'}
            >
              <thead>
                <tr>
                  <th>
                    <Text>Title</Text>
                  </th>
                  <th>
                    <Text>Invited at</Text>
                  </th>
                  <th>
                    <Text></Text>
                  </th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Group>
        </Group>
      )}

      {showNotification && (
        <NotificationBox
          title={
            showNotification === 'success'
              ? option === 'ACCEPTED'
                ? 'You got into the project!'
                : 'You rejected the invite.'
              : 'Error!'
          }
          type={showNotification}
          content={
            showNotification === 'success'
              ? option === 'ACCEPTED'
                ? 'Now you can assign a task to this project!'
                : 'If you want to be invited again for this project, review your rejections in settings.'
              : 'Some error occurred, try again!'
          }
          onClose={() => {
            setShowNotification(undefined);
          }}
          icon={
            showNotification === 'success' &&
            option === 'REJECTED' && <IconThumbDown size={18} />
          }
        />
      )}
    </>
  );
};

export default Invites;
