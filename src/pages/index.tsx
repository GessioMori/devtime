import { SignIn } from '@/components/SignInButton'
import { Group } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function IndexPage() {
  const session = useSession()
  const router = useRouter()

  if (session.status === 'loading') {
    return <div></div>
  }

  if (session.status === 'authenticated') {
    router.push('/dashboard')
  }

  return (
    <Group mt={50} position="center">
      <SignIn />
    </Group>
  )
}
