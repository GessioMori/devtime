import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth/next'

export const getServerSession: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      session
    }
  }
}
