import { Loading } from '@/components/Loading';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

const IndexPage = () => {
  return <Loading />;
};

IndexPage.public = true;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    redirect: {
      destination: '/dashboard/tasks',
      permanent: false
    }
  };
};

export default IndexPage;
