import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import { Center, Container, Loader } from '@mantine/core'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { z } from 'zod'

const ProjectDetailsPage: NextPageWithLayout<{ projectId: string }> = ({
  projectId
}) => {
  const router = useRouter()
  const { data, isLoading } = trpc.projects.getProject.useQuery(projectId, {
    onError() {
      router.push('/dashboard/projects/notFound')
    },
    retry: false
  })

  if (isLoading) {
    return (
      <Center p={'xl'}>
        <Loader variant="bars" color={'cyan'} />
      </Center>
    )
  }

  return <Container>{JSON.stringify(data)}</Container>
}

ProjectDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default ProjectDetailsPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const projectId =
    typeof ctx.params?.projectId === 'string' ? ctx.params?.projectId : null

  if (!projectId) {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard/projects/notFound'
      }
    }
  }

  const checkId = z.string().cuid()

  const isIdValid = checkId.safeParse(projectId)

  if (!isIdValid.success) {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard/projects/notFound'
      }
    }
  }

  return {
    props: {
      projectId
    }
  }
}
