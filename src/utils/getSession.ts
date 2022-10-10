import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth/next'

export const getServerSession: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  session.user.githubId = 'dsadas'

  return {
    props: {
      session
    }
  }
}
