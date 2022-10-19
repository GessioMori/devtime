import { SignIn } from '@/components/SignInButton'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Group } from '@mantine/core'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth/next'

const IndexPage = () => {
  return (
    <Group mt={50} position="center">
      <SignIn />
    </Group>
  )
}

IndexPage.public = true

export default IndexPage

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (session) {
    return {
      redirect: {
        destination: '/dashboard/tasks',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}
