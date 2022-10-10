import { TRPCError } from '@trpc/server'
import { T } from '.'

interface Repository {
  id: string
  url: string
  language: string
  name: string
}

export const authRouter = (t: T) =>
  t.router({
    getSession: t.procedure.query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.session.user.id }
      })

      return account?.providerAccountId
    }),

    getUserDetails: t.procedure.query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      if (!ctx.session.user.githubId) {
        const account = await ctx.prisma.account.findFirst({
          where: { userId: ctx.session.user.id }
        })
        if (account) {
          ctx.session.user.githubId = account?.providerAccountId
        }
      }
      const githubId = ctx.session.user.githubId

      const repos = await fetch(`https://api.github.com/user/${githubId}/repos`)
        .then((res) => res.json())
        .then((repos: Repository[]) =>
          repos.map((repo) => {
            return {
              id: repo.id,
              url: repo.url,
              language: repo.language,
              name: repo.name
            }
          })
        )

      return {
        repos,
        user: ctx.session.user
      }
    })
  })
