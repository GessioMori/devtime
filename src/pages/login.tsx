import { prisma } from '@/server/db/client';
import { Button, Group, Space, Stack, Text } from '@mantine/core';
import { IconBrandGithub, IconBrandTabler } from '@tabler/icons';
import { GetStaticProps } from 'next';
import { signIn } from 'next-auth/react';
import Typewriter from 'typewriter-effect';

type loginPageProps = {
  totalProjects: number;
  totalTasks: number;
  totalUsers: number;
};

const LoginPage = ({
  totalProjects,
  totalTasks,
  totalUsers
}: loginPageProps) => {
  return (
    <Stack
      align={'center'}
      justify="center"
      sx={{ marginTop: '10vh' }}
      spacing="xl"
    >
      <Group spacing={'sm'}>
        <IconBrandTabler size={64} color="#3164cc" />
        <Text
          variant="gradient"
          gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
          size={64}
          weight={800}
        >
          DevTime
        </Text>
      </Group>
      <Group
        sx={{
          display: 'flex',
          alignContent: 'center'
        }}
        align="center"
        position="center"
      >
        <Stack px={'xl'} py={0} justify="space-around" sx={{ height: '300px' }}>
          <div>
            <Text
              sx={{
                fontSize: 'clamp(3rem, 2vw, 4rem)',
                fontWeight: 'bolder',
                color: '#1098ad',
                fontFamily: 'Greycliff CF, sans-serif',
                lineHeight: '3rem'
              }}
              color="teal"
            >
              Your time matters
            </Text>
            <Space h={'lg'} />
            <Text
              sx={{
                fontFamily: 'Greycliff CF, sans-serif',
                fontSize: 'clamp(2rem, 1.5vw, 3rem)',
                fontWeight: 'bold',
                color: '#A6A7AB',
                lineHeight: '2rem'
              }}
            >
              And all that matters<br></br> should be counted
            </Text>
          </div>
          <Button
            variant="filled"
            color={'dark'}
            leftIcon={<IconBrandGithub />}
            size={'lg'}
            onClick={() =>
              signIn('github', {
                callbackUrl: `${window.location.origin}/dashboard/tasks`
              })
            }
          >
            Login with Github
          </Button>
        </Stack>
        <Group
          align={'flex-start'}
          sx={{
            backgroundColor: '#25262b',
            borderRadius: '8px',
            height: '300px',
            width: 'clamp(300px, 95vw, 400px)'
          }}
          p={'lg'}
        >
          <Typewriter
            options={{
              loop: true,
              delay: 40,
              cursorClassName: 'cursor'
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString(
                  `
              <span style="font-family: monospace; font-weight: semi-bold; font-size: 1.2rem">
              <span style="color: #339af0">const </span><span style="color: #3bc9db">devTime</span> = {  
              <br>
              <span>  url:</span><span style="color: #ffe066"> 'devtime.gm4.tech'</span>,
              <br>
              <span>  totalUsers:</span><span style="color: #4263eb"> ${totalUsers}</span>,
              <br>
              <span>  projectsCreated:</span><span style="color: #4263eb"> ${totalProjects}</span>,
              <br>
              <span>  tasksCompleted:</span><span style="color: #4263eb"> ${totalTasks}</span>,
              <br>
              }
              </span>
              `
                )
                .start()
                .deleteAll(1);
            }}
          />
        </Group>
      </Group>
    </Stack>
  );
};

LoginPage.public = true;

export const getStaticProps: GetStaticProps<loginPageProps> = async () => {
  const totalUsers = await prisma.user.count();
  const totalTasks = await prisma.task.count();
  const totalProjects = await prisma.project.count();

  return {
    props: {
      totalProjects,
      totalTasks,
      totalUsers
    },
    revalidate: 24 * 60 * 60 // 1 day
  };
};

export default LoginPage;
