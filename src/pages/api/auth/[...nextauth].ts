import { prisma } from '@/server/db/client'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile, _) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          githubId: profile.id.toString()
        }
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      console.log('___________________ NEW SESSION REQUEST _________________')
      if (session.user) {
        session.user.id = user.id
        session.user.githubId = user.githubId
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
