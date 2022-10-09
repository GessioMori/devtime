import { initTRPC } from '@trpc/server'

import { authRouter } from './auth'
import { Context } from './context'

export const t = initTRPC.context<Context>().create({})

export type T = typeof t

export const appRouter = t.router({
  auth: t.mergeRouters(authRouter(t))
})

export type AppRouter = typeof appRouter
