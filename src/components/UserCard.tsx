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

interface UserCardProps {
  direction: 'right' | 'down'
  className?: string
}

export function UserCard({ className, direction }: UserCardProps) {
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
                  <Avatar
                    src="https://avatars.githubusercontent.com/u/58918025?v=4"
                    radius="xl"
                  />
                  <Box sx={{ flex: 1 }}>
                    <Text size="sm" weight={500}>
                      Gessio Mori
                    </Text>
                    <Text color="dimmed" size="xs">
                      gessiomorin@gmail.com
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
            <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
            <Menu.Item
              icon={<IconLogout size={14} />}
              onClick={() => signOut()}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    )
  }
}
