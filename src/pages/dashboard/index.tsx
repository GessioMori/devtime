import { NextPageWithLayout } from '@/pages/_app'
import { Text } from '@mantine/core'
import { Session } from 'next-auth'
import type { ReactElement } from 'react'
import Layout from '../../components/Layout'

interface DashboardProps {
  session: Session
}

const Dashboard: NextPageWithLayout<DashboardProps> = () => {
  return <Text>INDEX</Text>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Dashboard
