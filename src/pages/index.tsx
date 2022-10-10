import { SignIn } from '@/components/SignInButton'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Group } from '@mantine/core'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth/next'

export default function IndexPage() {
  return (
    <Group mt={50} position="center">
      <SignIn />
    </Group>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}
