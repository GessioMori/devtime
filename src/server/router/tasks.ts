import { TRPCError } from '@trpc/server'
import { intervalToDuration } from 'date-fns'
import { z } from 'zod'
import { T } from '.'

export const tasksRouter = (t: T) =>
  t.router({
    createTask: t.procedure
      .input(
        z.object({
          title: z.string().min(10),
          description: z.string().optional(),
          projectId: z.string().cuid().optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.session) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        const newTask = await ctx.prisma.task.create({
          data: {
            title: input.title,
            description: input.description,
            startTime: new Date(),
            userId: ctx.session.user?.id!,
            projectId: input.projectId
          }
        })
        return newTask
      }),
    getTasks: t.procedure.query(async ({ ctx }) => {
      if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
      const tasks = await ctx.prisma.task.findMany({
        where: {
          userId: ctx.session.user?.id
        },
        include: {
          project: {
            select: {
              title: true
            }
          }
        },
        orderBy: {
          startTime: 'desc'
        }
      })

      return tasks
    }),
    getCurrentTask: t.procedure.query(async ({ ctx }) => {
      const currentTask = await ctx.prisma.task.findFirst({
        where: {
          userId: ctx.session?.user?.id,
          finishTime: null
        },
        include: {
          project: true
        }
      })
      return currentTask
    }),
    endTask: t.procedure
      .input(z.string().cuid())
      .mutation(async ({ ctx, input: taskId }) => {
        const task = await ctx.prisma.task.findFirst({
          where: {
            id: taskId,
            userId: ctx.session?.user?.id
          }
        })

        if (!task) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }

        const finishTime = new Date()

        const durationObj = intervalToDuration({
          end: finishTime,
          start: task.startTime
        })

        let duration: string

        if (durationObj.days && durationObj.days > 1) {
          duration = `${durationObj.days} days`
        } else if (durationObj.days === 1) {
          duration = '1 day'
        } else {
          duration = `${durationObj.hours}:${String(
            durationObj.minutes
          ).padStart(2, '0')}`
        }

        const updatedTask = await ctx.prisma.task.update({
          where: {
            id: taskId
          },
          data: {
            finishTime,
            duration
          }
        })
        return updatedTask
      })
  })
