import type { ReactElement } from 'react'
import Layout from '../../components/Layout'
import { NextPageWithLayout } from '../_app'

const Dashboard: NextPageWithLayout = () => {
  return <p>Dashboard</p>
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Dashboard
