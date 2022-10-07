import { Text } from '@mantine/core'
import type { ReactElement } from 'react'
import Layout from '../../components/Layout'
import { NextPageWithLayout } from '../_app'

const Dashboard: NextPageWithLayout = () => {
  return <Text>INDEX</Text>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Dashboard
