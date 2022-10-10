import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import type { ReactElement } from 'react'

const Projects: NextPageWithLayout = () => {
  return <div>Loading...</div>
}

Projects.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

//export const getServerSideProps: GetServerSideProps = getServerSession

export default Projects
