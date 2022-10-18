import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import Layout from './Layout'

interface LayoutProps {
  children: ReactNode
}

export const Auth = ({ children }: LayoutProps) => {
  const router = useRouter()
  const { status, data: sessionData } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    }
  })

  if (status === 'loading') {
    return <div></div>
  }

  return <Layout sessionData={sessionData}>{children}</Layout>
}
