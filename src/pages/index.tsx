import { Button, Group, Space, Stack, Text } from '@mantine/core';
import { IconBrandGithub, IconBrandTabler } from '@tabler/icons';
import { signIn } from 'next-auth/react';
import Typewriter from 'typewriter-effect';

const IndexPage = () => {
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
                callbackUrl: `${window.location.origin}/dashboard`
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
              <span>  url:</span><span style="color: #ffe066"> 'devTime.gmori.dev'</span>,
              <br>
              <span>  accessCount:</span><span style="color: #4263eb"> 9832</span>,
              <br>
              <span>  totalUsers:</span><span style="color: #4263eb"> 321</span>,
              <br>
              <span>  projectsCreated:</span><span style="color: #4263eb"> 64</span>,
              <br>
              <span>  tasksCompleted:</span><span style="color: #4263eb"> 981</span>,
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

IndexPage.public = true;

export default IndexPage;
