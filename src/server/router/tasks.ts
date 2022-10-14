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

      return tasks.map((task) => {
        const durationObjOrNull = task.endTime
          ? intervalToDuration({ end: task.endTime, start: task.startTime })
          : null
        let duration: string
        if (durationObjOrNull) {
          if (durationObjOrNull.days && durationObjOrNull.days > 1) {
            duration = `${durationObjOrNull.days} days`
          } else if (durationObjOrNull.days === 1) {
            duration = `${durationObjOrNull.days} day`
          } else {
            duration = `${durationObjOrNull.hours}:${String(
              durationObjOrNull.minutes
            ).padStart(2, '0')}`
          }
        } else {
          duration = '-'
        }

        return {
          ...task,
          duration
        }
      })
    }),
    getCurrentTask: t.procedure.query(async ({ ctx }) => {
      const currentTask = await ctx.prisma.task.findFirst({
        where: {
          userId: ctx.session?.user?.id,
          endTime: null
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
        const updatedTask = await ctx.prisma.task.update({
          where: {
            id: taskId
          },
          data: {
            endTime: new Date()
          }
        })
        return updatedTask
      })
  })
