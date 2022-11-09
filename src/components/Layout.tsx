import {
  AppShell,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  NavLink,
  Text
} from '@mantine/core';
import {
  IconBrandTabler,
  IconChartBar,
  IconListCheck,
  IconTerminal2
} from '@tabler/icons';
import { Session } from 'next-auth';
import Link from 'next/link';
import Router from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Loading } from './Loading';
import { UserCard } from './UserCard';

interface LayoutProps {
  sessionData: Session | null;
}

export default function Layout({
  children,
  sessionData
}: PropsWithChildren<LayoutProps>) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Navbar.Section grow>
            <NavLink
              icon={<IconListCheck />}
              label="Tasks"
              defaultOpened={true}
            >
              <Link href={'/dashboard/tasks'}>
                <NavLink
                  label="New/current task"
                  onClick={() => setOpened((o) => !o)}
                />
              </Link>
              <Link href={'/dashboard/tasks/list'}>
                <NavLink
                  label="Manage my tasks"
                  onClick={() => setOpened((o) => !o)}
                />
              </Link>
            </NavLink>
            <NavLink
              icon={<IconTerminal2 />}
              label="Projects"
              defaultOpened={true}
            >
              <Link href={'/dashboard/projects/create'}>
                <NavLink
                  label="Create new project"
                  onClick={() => setOpened((o) => !o)}
                />
              </Link>
              <Link href={'/dashboard/projects/list'}>
                <NavLink
                  label="Manage projects"
                  onClick={() => setOpened((o) => !o)}
                />
              </Link>
              <Link href={'/dashboard/projects/invites'}>
                <NavLink
                  label="Project invites"
                  onClick={() => setOpened((o) => !o)}
                />
              </Link>
            </NavLink>
            <NavLink
              icon={<IconChartBar />}
              label="Statistics"
              defaultOpened={true}
            >
              <Link href={'/dashboard/statistics/tasks'}>
                <NavLink label="Tasks" onClick={() => setOpened((o) => !o)} />
              </Link>
              <Link href={'/dashboard/statistics/projects'}>
                <NavLink
                  label="Projects"
                  onClick={() => setOpened((o) => !o)}
                />
              </Link>
            </NavLink>
          </Navbar.Section>
          <Navbar.Section>
            <MediaQuery largerThan={'sm'} styles={{ display: 'none' }}>
              <UserCard
                direction="right"
                username={sessionData?.user?.name}
                imageUrl={sessionData?.user?.image}
                email={sessionData?.user?.email}
              />
            </MediaQuery>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'space-between'
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color="#868e96"
                mr="xl"
              />
            </MediaQuery>
            <Group spacing={'sm'}>
              <IconBrandTabler size={40} color="#3164cc" />
              <Text
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                size={32}
                weight={800}
              >
                DevTime
              </Text>
            </Group>
            <MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
              <UserCard
                direction="down"
                username={sessionData?.user?.name}
                imageUrl={sessionData?.user?.image}
                email={sessionData?.user?.email}
              />
            </MediaQuery>
          </div>
        </Header>
      }
    >
      {loading ? <Loading /> : children}
    </AppShell>
  );
}
