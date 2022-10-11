import { TRPCError } from '@trpc/server'
import { T } from '.'

interface Repository {
  id: string
  url: string
  language: string
  name: string
  svn_url: string
}

export const githubRouter = (t: T) =>
  t.router({
    getUserRepositories: t.procedure.query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      console.log('_________________ GET USER REPOS _____________________')

      const repositories = await fetch(
        `https://api.github.com/user/${ctx.session.user.githubId}/repos`
      )
        .then((res) => res.json())
        .then((repos: Repository[]) =>
          repos.map((repo) => {
            return {
              id: repo.id,
              url: repo.svn_url,
              language: repo.language,
              name: repo.name
            }
          })
        )

      return {
        repositories
      }
    })
  })
