import { SignIn } from '@/components/SignInButton'
import { Group } from '@mantine/core'

export default function IndexPage() {
  return (
    <Group mt={50} position="center">
      <SignIn />
    </Group>
  )
}

/* export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
} */
