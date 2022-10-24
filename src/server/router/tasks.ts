import { TRPCError } from '@trpc/server'
import { intervalToDuration } from 'date-fns'
import { z } from 'zod'
import { T } from '.'
import { authMiddleware } from './middleware'

export const tasksRouter = (t: T) =>
  t.router({
    createTask: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          title: z.string().min(5).max(100),
          description: z.string().optional(),
          projectId: z.string().cuid().optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        console.log('PROJECT ID: ', input.projectId)

        const newTask = await ctx.prisma.task.create({
          data: {
            title: input.title,
            description: input.description,
            startTime: new Date(),
            userId: ctx.user.id,
            projectId: input.projectId
          }
        })
        return newTask
      }),
    getTasks: t.procedure.use(authMiddleware(t)).query(async ({ ctx }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: {
          userId: ctx.user.id
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
    getCurrentTask: t.procedure
      .use(authMiddleware(t))
      .query(async ({ ctx }) => {
        const currentTask = await ctx.prisma.task.findFirst({
          where: {
            userId: ctx.user.id,
            finishTime: null
          },
          include: {
            project: true
          }
        })
        return currentTask
      }),
    finishTask: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          taskId: z.string().cuid(),
          githubCommitUrl: z.string().url().nullish()
        })
      )
      .mutation(async ({ ctx, input: { taskId, githubCommitUrl } }) => {
        const task = await ctx.prisma.task.findFirst({
          where: {
            id: taskId,
            userId: ctx.user.id
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
            duration,
            githubCommitUrl
          }
        })

        return updatedTask
      }),
    deleteTask: t.procedure
      .use(authMiddleware(t))
      .input(z.string().cuid())
      .mutation(async ({ ctx, input: taskId }) => {
        const task = await ctx.prisma.task.findUnique({
          where: { id: taskId }
        })
        if (!task) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        } else if (task.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' })
        }

        await ctx.prisma.task.delete({
          where: {
            id: taskId
          }
        })

        return true
      })
  })
