import {
  Avatar,
  Box,
  Group,
  Menu,
  Text,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import {
  IconChevronDown,
  IconChevronRight,
  IconLogout,
  IconSettings,
  IconUserCircle
} from '@tabler/icons'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

interface UserCardProps {
  direction: 'right' | 'down'
  className?: string
  username: string | null | undefined
  email: string | null | undefined
  imageUrl: string | null | undefined
}

export function UserCard({
  className,
  direction,
  email,
  imageUrl,
  username
}: UserCardProps) {
  {
    const theme = useMantineTheme()
    return (
      <Box className={className}>
        <Menu width="target">
          <Menu.Target>
            <Box>
              <UnstyledButton
                sx={{
                  display: 'block',
                  width: '100%',
                  padding: theme.spacing.xs,
                  color: theme.colors.dark[0]
                }}
              >
                <Group>
                  <Avatar src={imageUrl} radius="xl" />
                  <Box sx={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                      {username}
                    </Text>
                    <Text color="dimmed" size="xs">
                      {email}
                    </Text>
                  </Box>
                  {direction === 'right' ? (
                    <IconChevronRight size={18} />
                  ) : (
                    <IconChevronDown size={18} />
                  )}
                </Group>
              </UnstyledButton>
            </Box>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconUserCircle size={14} />}>Account</Menu.Item>
            <Link href={'/dashboard/user/settings'}>
              <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
            </Link>
            <Menu.Item
              icon={<IconLogout size={14} />}
              onClick={() => signOut()}
              color={'red'}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    )
  }
}
