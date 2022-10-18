import {
  AppShell,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  NavLink,
  Text
} from '@mantine/core'
import {
  IconChartBar,
  IconCodeCircle2,
  IconHome,
  IconListCheck,
  IconTerminal2
} from '@tabler/icons'
import { Session } from 'next-auth'
import Link from 'next/link'
import { ReactNode, useState } from 'react'
import { UserCard } from './UserCard'

interface LayoutProps {
  children: ReactNode
  sessionData: Session | null
}

export default function Layout({ children, sessionData }: LayoutProps) {
  const [opened, setOpened] = useState(false)

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
            <Link href={'/dashboard'}>
              <NavLink
                icon={<IconHome />}
                label="Home"
                onClick={() => setOpened((o) => !o)}
              />
            </Link>
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
              <Link href={'/dashboard/projects'}>
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
              <Link href={'/dashboard/projects'}>
                <NavLink label="Tasks" onClick={() => setOpened((o) => !o)} />
              </Link>
              <Link href={'/dashboard/projects'}>
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
              <IconCodeCircle2 size={40} color="#3bc9db" />
              <Text color={'cyan.2'} size={32} weight={800}>
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
      {children}
    </AppShell>
  )
}
