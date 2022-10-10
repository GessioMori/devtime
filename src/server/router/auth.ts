import { TRPCError } from '@trpc/server'
import { T } from '.'

export const authRouter = (t: T) =>
  t.router({
    secretPlace: t.procedure.query(async ({ ctx }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      return ctx.session.user
    })
  })
