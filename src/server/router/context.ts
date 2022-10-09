import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { getSession } from 'next-auth/react'

import { prisma } from '@/server/db/client'

export const createContext = async ({
  req,
  res
}: trpcNext.CreateNextContextOptions) => {
  const session = await getSession({ req })

  return {
    req,
    res,
    session,
    prisma
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
