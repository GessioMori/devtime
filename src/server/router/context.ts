import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { getSession } from 'next-auth/react'

import { prisma } from '@/server/db/client'

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const session = await getSession(opts)

  console.log('createContext for', session?.user?.name ?? 'unknown user')

  return {
    session,
    prisma
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
