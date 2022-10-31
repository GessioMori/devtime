import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import Layout from './Layout';

export const Auth = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const { status, data: sessionData } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/');
    }
  });

  if (status === 'loading') {
    return <div></div>;
  }

  return <Layout sessionData={sessionData}>{children}</Layout>;
};
