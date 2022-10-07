import { initTRPC } from '@trpc/server'
import { format } from 'date-fns'
import { z } from 'zod'

export const t = initTRPC.create()

const dateFormat = 'dd/MM/yy - HH:mm'

const mockTasks = [
  {
    id: Math.floor(Math.random() * 1000),
    title: 'task1',
    description: 'description1',
    githubCommitUrl: 'github.com',
    startTime: format(new Date(1665143000000), dateFormat),
    endTime: format(new Date(1665146000000), dateFormat)
  },
  {
    id: Math.floor(Math.random() * 1000),
    title: 'task2',
    description: 'description2',
    githubCommitUrl: 'github.com',
    startTime: format(new Date(1665148000000), dateFormat),
    endTime: format(new Date(1665150000000), dateFormat)
  }
]

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
      tasks: [...mockTasks, ...mockTasks, ...mockTasks]
    }
  })
})

export type AppRouter = typeof appRouter
