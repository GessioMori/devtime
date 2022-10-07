import type { ReactElement } from 'react'
import Layout from '../../components/Layout'
import { trpc } from '../../utils/trpc'
import { NextPageWithLayout } from '../_app'

const Projects: NextPageWithLayout = () => {
  const hello = trpc.hello.useQuery({ text: 'Gessio' })

  if (!hello.data) {
    return <div>Loading...</div>
  }

  return <div>{hello.data.greeting}</div>
}

Projects.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Projects
