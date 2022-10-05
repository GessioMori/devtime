import type { ReactElement } from 'react'
import Layout from '../../components/Layout'
import { NextPageWithLayout } from '../_app'

const Projects: NextPageWithLayout = () => {
  return <p>Projects</p>
}

Projects.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Projects
