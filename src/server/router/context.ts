import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions as nextAuthOptions } from '../../pages/api/auth/[...nextauth]'

import { prisma } from '@/server/db/client'

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const session = await unstable_getServerSession(
    opts.req,
    opts.res,
    nextAuthOptions
  )

  return {
    session,
    prisma
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
