import Layout from '@/components/Layout'
import { getServerSession } from '@/utils/getSession'

export default function Protected() {
  return <Layout>{<div>das</div>}</Layout>
}

function content1() {
  return <div>Content 1</div>
}

function content2() {
  return <div>Content 2</div>
}

export const getServerSideProps = getServerSession
