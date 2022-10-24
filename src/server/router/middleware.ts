import { TRPCError } from '@trpc/server'
import { T } from '.'

export const authMiddleware = (t: T) =>
  t.middleware(async ({ ctx, next }) => {
    if (
      !ctx.session ||
      !ctx.session.user ||
      !ctx.session.user.id ||
      !ctx.session.user.githubId ||
      !ctx.session.user.email
    ) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User id not provided.'
      })
    }

    return next({
      ctx: {
        user: {
          id: ctx.session.user.id,
          githubId: ctx.session.user.githubId,
          name: ctx.session.user.name,
          email: ctx.session.user.email,
          image: ctx.session.user.image
        }
      }
    })
  })
