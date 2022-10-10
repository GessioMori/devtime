import {
  AppShell,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  NavLink,
  Text,
  useMantineTheme
} from '@mantine/core'
import {
  IconChartBar,
  IconCodeCircle2,
  IconHome,
  IconListCheck,
  IconTerminal2
} from '@tabler/icons'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import { UserCard } from './UserCard'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  const router = useRouter()

  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    }
  })

  if (session.status === 'loading') {
    return <div></div>
  }

  const user = {
    username: session.data.user?.name,
    email: session.data.user?.email,
    imageUrl: session.data.user?.image
  }

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
              <Link href={'/dashboard/tasks/new'}>
                <NavLink
                  label="Start a new task"
                  onClick={() => setOpened((o) => !o)}
                />
              </Link>
              <Link href={'/dashboard/tasks'}>
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
              <Link href={'/dashboard/projects'}>
                <NavLink
                  label="Create new project"
                  onClick={() => setOpened((o) => !o)}
                />
              </Link>
              <Link href={'/dashboard/projects'}>
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
                username={user.username}
                imageUrl={user.imageUrl}
                email={user.email}
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
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Group spacing={'sm'}>
              <IconCodeCircle2 size={40} color={theme.colors.cyan[4]} />
              <Text color={'cyan.2'} size={32} weight={800}>
                DevTime
              </Text>
            </Group>
            <MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
              <UserCard
                direction="down"
                username={user.username}
                imageUrl={user.imageUrl}
                email={user.email}
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
