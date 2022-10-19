import { trpc } from '@/utils/trpc'
import { Button, Container, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconAt, IconCheck, IconSend } from '@tabler/icons'
import { TRPCErrorShape } from '@trpc/server/rpc'
import { FunctionComponent, useState } from 'react'
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
  const [success, setSuccess] = useState<boolean>(false)

  const makeInvitationMutation = trpc.invites.createInvitation.useMutation()

  const makeInvitation = async () => {
    await makeInvitationMutation
      .mutateAsync({ projectId, receiverEmail: form.values.email })
      .then(() => {
        form.reset()
        setSuccess(true)
        setTimeout(() => setSuccess(false), 1000)
      })
      .catch((err: TRPCErrorShape) => form.setErrors({ email: err.message }))
  }

  return (
    <Container p={0}>
      <form
        onSubmit={form.onSubmit(() => makeInvitation())}
        style={{ width: '100%' }}
      >
        <Group align={'flex-start'}>
          <TextInput
            placeholder="Email to send invitation"
            icon={<IconAt size={14} />}
            {...form.getInputProps('email')}
            style={{ flex: 1 }}
          />
          <Button
            type="submit"
            leftIcon={success ? <IconCheck /> : <IconSend />}
            loading={makeInvitationMutation.isLoading}
          >
            {success ? 'Invite sent!' : 'Invite'}
          </Button>
        </Group>
      </form>
    </Container>
  )
}
