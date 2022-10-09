import NextAuth from 'next-auth/next'
import GithubProvider from 'next-auth/providers/github'

import { prisma } from '@/server/db/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!
    })
  ]
}

export default NextAuth(authOptions)
