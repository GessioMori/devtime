import { T } from '.'

export const authRouter = (t: T) =>
  t.router({
    secretPlace: t.procedure.query(async ({ ctx }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (!ctx.session) {
        return 'NO'
      }
      return ctx.session.user
    })
  })
