import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { ReactElement } from 'react'

const ProjectNotFound: NextPageWithLayout = () => {
  return <div>NOT FOUND</div>
}

ProjectNotFound.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default ProjectNotFound
