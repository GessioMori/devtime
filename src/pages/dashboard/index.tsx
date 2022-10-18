import { NextPageWithLayout } from '@/pages/_app'
import { Text } from '@mantine/core'
import { Session } from 'next-auth'

interface DashboardProps {
  session: Session
}

const Dashboard: NextPageWithLayout<DashboardProps> = () => {
  return <Text>INDEX</Text>
}

export default Dashboard
