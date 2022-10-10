import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { T } from '.'

export const tasksRouter = (t: T) =>
  t.router({
    createTask: t.procedure
      .input(
        z.object({
          title: z.string().min(10),
          description: z.string().optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.session) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
        const newTask = await ctx.prisma.tasks.create({
          data: {
            title: input.title,
            description: input.description,
            startTime: new Date(),
            userId: ctx.session.user?.id!
          }
        })
        return newTask
      })
  })
