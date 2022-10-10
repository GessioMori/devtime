import { Text } from '@mantine/core'
import { Session } from 'next-auth'
import type { ReactElement } from 'react'
import Layout from '../../components/Layout'
import { NextPageWithLayout } from '../_app'

interface DashboardProps {
  session: Session
}

const Dashboard: NextPageWithLayout<DashboardProps> = () => {
  return <Text>INDEX</Text>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

//export const getServerSideProps: GetServerSideProps = getServerSession

export default Dashboard
