import Layout from '@/components/Layout'
import { NextPageWithLayout } from '@/pages/_app'
import { trpc } from '@/utils/trpc'
import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Loader,
  Menu,
  Modal,
  Stack,
  Table,
  Text
} from '@mantine/core'
import {
  IconBrandGithub,
  IconCircleX,
  IconDots,
  IconPencil,
  IconTerminal2
} from '@tabler/icons'

import { ReactElement, useState } from 'react'

const ListProjectsPage: NextPageWithLayout = () => {
  const [projectToDelete, setProjectToDelete] = useState<string>('')

  const { data: projects, isLoading } = trpc.projects.listProjects.useQuery()
  const deleteProjectMutation = trpc.projects.deleteProject.useMutation()

  if (isLoading) {
    return <Loader />
  }

  const deleteProject = async (projectId: string) => {
    await deleteProjectMutation.mutateAsync(projectId).then(() => {
      setProjectToDelete('')
      projects?.splice(
        projects.findIndex((project) => projectId === project.id),
        1
      )
    })
  }

  const rows = projects!.map((project) => (
    <tr key={project.id}>
      <td>
        <Text>{project.title}</Text>
      </td>
      <td>{project.description}</td>
      <td>
        <Menu position={'bottom-end'}>
          <Menu.Target>
            <ActionIcon variant={'outline'}>
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconTerminal2 />}>See project details</Menu.Item>
            <Menu.Item icon={<IconPencil />}>Edit project</Menu.Item>
            {project.githubRepoUrl && (
              <Anchor
                underline={false}
                href={project.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Menu.Item icon={<IconBrandGithub />}>
                  Go to Github repository
                </Menu.Item>
              </Anchor>
            )}
            <Menu.Item
              color={'red.5'}
              icon={<IconCircleX />}
              onClick={() => setProjectToDelete(project.id)}
            >
              Delete project
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ))

  return (
    <>
      <Modal
        opened={!!projectToDelete}
        onClose={() => setProjectToDelete('')}
        withCloseButton={false}
      >
        <Stack>
          <Text inline>
            Are you sure you want to delete{' '}
            {projectToDelete &&
              (projects?.filter((project) => project.id === projectToDelete)[0]
                ?.title ||
                '')}
            ?
          </Text>
          <Text color={'dimmed'} inline>
            (This action can not be undone)
          </Text>
          <Stack spacing={'xs'}>
            <Button
              color={'red'}
              variant="outline"
              fullWidth
              loading={deleteProjectMutation.status === 'loading'}
              onClick={() => deleteProject(projectToDelete)}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setProjectToDelete('')}
              fullWidth
            >
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Modal>
      <Container>
        <Table verticalSpacing={'md'} highlightOnHover={true} align={'center'}>
          <thead>
            <tr>
              <th style={{ width: '35%' }}>
                <Text>Title</Text>
              </th>
              <th style={{ width: '60%' }}>
                <Text>Description</Text>
              </th>
              <th style={{ width: '5%' }}>
                <Text></Text>
              </th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Container>
    </>
  )
}

ListProjectsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default ListProjectsPage