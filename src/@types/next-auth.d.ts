import { DefaultSession } from 'next-auth'

interface Repository {
  id: string
  url: string
  language: string
  name: string
}

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string
      githubId?: string
      repositories?: Repository[]
    } & DefaultSession['user']
  }
}
