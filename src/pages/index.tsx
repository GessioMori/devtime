import { Button, Group, Text, useMantineTheme } from '@mantine/core'

export default function IndexPage() {
  const theme = useMantineTheme()
  return (
    <Group mt={50} position="center">
      <Text size={'lg'}>Test</Text>
      <Button size="xl" variant={'outline'} color={'test'}>
        Welcome to Mantine!
      </Button>
    </Group>
  )
}
