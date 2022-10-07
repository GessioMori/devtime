import { initTRPC } from '@trpc/server'
import { z } from 'zod'

export const t = initTRPC.create()

export const appRouter = t.router({
  hello: t.procedure
    .input(
      z
        .object({
          text: z.string().nullish()
        })
        .nullish()
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`
      }
    }),
  tasks: t.procedure.query(({}) => {
    return {
      tasks: [
        {
          id: Math.floor(Math.random() * 1000),
          title: 'task1',
          description: 'description1',
          githubCommitUrl: 'github.com',
          startTime: new Date(1665143000),
          endTime: new Date()
        },
        {
          id: Math.floor(Math.random() * 1000),
          title: 'task2',
          description: 'description2',
          githubCommitUrl: 'github.com',
          startTime: new Date(1665143000),
          endTime: new Date()
        }
      ]
    }
  })
})

export type AppRouter = typeof appRouter
