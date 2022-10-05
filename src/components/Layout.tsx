import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  NavLink,
  Text,
  useMantineTheme
} from '@mantine/core'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const theme = useMantineTheme()
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
          <Link href={'/dashboard'}>
            <NavLink label="Dashboard" onClick={() => setOpened((o) => !o)} />
          </Link>

          <Link href={'/dashboard/projects'}>
            <NavLink label="Projects" onClick={() => setOpened((o) => !o)} />
          </Link>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
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

            <Text>Application header</Text>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  )
}
