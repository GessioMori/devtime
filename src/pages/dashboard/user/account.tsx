import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Center, Code, Container, Space, Text, Title } from '@mantine/core';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import Image from 'next/image';

type AccountPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const AccountPage: NextPage<AccountPageProps> = ({ session }) => {
  return (
    <Container size={960}>
      <Title order={3}>User card</Title>
      <Center m={'md'}>
        <Image
          src={`https://devtimeimggen.onrender.com/${session.user?.id}`}
          alt="User card"
          width={306}
          height={120}
        />
      </Center>
      <Text>
        To add this image to your Github profile README.md, paste the following
        code (user data is updated once a day):
      </Text>
      <Space h={'lg'} />
      <Code block>
        {`<p align="center"> <img src="https://devtimeimggen.onrender.com/${session.user?.id}"> </p>`}
      </Code>
    </Container>
  );
};

type serverReturnProps = {
  session: Session;
};

export const getServerSideProps: GetServerSideProps<serverReturnProps> = async (
  context
) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    };
  }

  return {
    props: {
      session
    }
  };
};

export default AccountPage;
