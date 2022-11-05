import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
  Button,
  Center,
  Code,
  Container,
  Space,
  Text,
  Title
} from '@mantine/core';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from 'next';
import { Session, unstable_getServerSession } from 'next-auth';
import Image from 'next/image';
import { useRouter } from 'next/router';

type AccountPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const AccountPage: NextPage<AccountPageProps> = ({ session }) => {
  const router = useRouter();

  const reloadImage = async () => {
    await fetch(
      `https://api.dotos.tech/devtimeusercard/purge/${session.user?.id}`
    )
      .then(() => {
        router.reload();
      })
      .catch((e) => console.error(e));
  };

  return (
    <Container size={960}>
      <Title order={3}>User card</Title>
      <Center m={'md'}>
        <Image
          src={`https://api.dotos.tech/devtimeusercard/card/${session.user?.id}`}
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
        {`<p align="center"> <img src="https://api.dotos.tech/devtimeusercard/card/${session.user?.id}"> </p>`}
      </Code>
      <Space h={'xl'} />
      <Center>
        <Button onClick={reloadImage}>Update user card</Button>
      </Center>
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
