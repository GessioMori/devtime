import { initTRPC } from '@trpc/server'
import { ZodError } from 'zod'

import { authRouter } from './auth'
import { Context } from './context'
import { tasksRouter } from './tasks'

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null
      }
    }
  }
})

export type T = typeof t

export const appRouter = t.router({
  auth: t.mergeRouters(authRouter(t)),
  tasks: t.mergeRouters(tasksRouter(t))
})

export type AppRouter = typeof appRouter
