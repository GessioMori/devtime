import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { useForm } from '@mantine/form'
import { ReactElement } from 'react'

const CreateProject: NextPageWithLayout = () => {
  const form = useForm({
    initialValues: {
      title: '',
      description: undefined
    },

    validate: {
      title: (value) =>
        value.length < 10 ? 'Name must have at least 10 letters' : null
    }
  })

  return <div>NEW PROJECT PAGE</div>
}

CreateProject.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default CreateProject
