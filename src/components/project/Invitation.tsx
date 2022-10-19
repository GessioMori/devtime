import { trpc } from '@/utils/trpc'
import { Button, Container, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAt, IconSend } from '@tabler/icons'
import { TRPCErrorShape } from '@trpc/server/rpc'
import { FunctionComponent } from 'react'
import { z } from 'zod'

interface InvitationProps {
  projectId: string
}

export const Invitation: FunctionComponent<InvitationProps> = ({
  projectId
}) => {
  const form = useForm({
    initialValues: {
      email: ''
    },
    validate: {
      email: (value) =>
        !z.string().email().safeParse(value).success
          ? 'Please enter a valid email'
          : null
    }
  })

  const makeInvitationMutation = trpc.invites.createInvitation.useMutation()

  const makeInvitation = async () => {
    await makeInvitationMutation
      .mutateAsync({ projectId, receiverEmail: form.values.email })
      .then((invite) => console.log(invite))
      .catch((err: TRPCErrorShape) => form.setErrors({ email: err.message }))
  }

  return (
    <Container>
      <form
        onSubmit={form.onSubmit(() => makeInvitation())}
        style={{ width: '100%' }}
      >
        <Group>
          <TextInput
            placeholder="Email to send invitation"
            icon={<IconAt size={14} />}
            {...form.getInputProps('email')}
            style={{ flex: 1 }}
          />
          <Button
            type="submit"
            leftIcon={<IconSend />}
            loading={makeInvitationMutation.isLoading}
          >
            Invite
          </Button>
        </Group>
      </form>
    </Container>
  )
}
