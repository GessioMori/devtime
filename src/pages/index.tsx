import { trpc } from '@/utils/trpc'
import { Button, Group, Text } from '@mantine/core'
import { signIn, signOut } from 'next-auth/react'

export default function IndexPage() {
  const { data, error, isLoading } = trpc.auth.secretPlace.useQuery()

  if (isLoading) {
    return <div>Is Loading</div>
  }

  if (data === 'NO') {
    return (
      <>
        Not signed in
        <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <Group mt={50} position="center">
      <Text size={'lg'}>{data?.email}</Text>
      <Button size="xl" variant={'outline'} color={'test'}>
        Welcome to Mantine!
      </Button>
      <button onClick={() => signOut()}>Sign out</button>
    </Group>
  )
}
