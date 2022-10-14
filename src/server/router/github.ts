import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { T } from '.'

interface Repository {
  id: string
  url: string
  language: string
  name: string
  svn_url: string
}

interface Commit {
  commit: {
    message?: string
    author: {
      date: string
      email: string
      name: string
    }
  }
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
    }),
    getLastCommits: t.procedure
      .input(z.string())
      .query(async ({ input: repoUrl }) => {
        const userNameRepoName = repoUrl.split('github.com')[1]
        const url = `https://api.github.com/repos${userNameRepoName}/commits?page=1&per_page=10`
        console.log(url)
        const commits: Commit[] = await fetch(url).then((res) => res.json())

        const mappedCommits = commits.map((commit) => {
          return {
            message: commit.commit.message,
            date: commit.commit.author.date,
            email: commit.commit.author.email,
            name: commit.commit.author.name
          }
        })

        return mappedCommits
      })
  })
