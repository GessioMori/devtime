import { TRPCError } from '@trpc/server';
import { differenceInSeconds, intervalToDuration } from 'date-fns';
import { z } from 'zod';
import { T } from '.';
import { authMiddleware } from './middleware';

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
        const date = new Date();

        const newTask = await ctx.prisma.task.create({
          data: {
            title: input.title,
            description: input.description,
            startTime: new Date(),
            userId: ctx.user.id,
            projectId: input.projectId,
            monthNumber: date.getMonth(),
            yearNumber: date.getFullYear()
          }
        });
        return newTask;
      }),
    getTasksByUser: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          limit: z.number().min(1).max(10).nullish(),
          cursor: z.string().nullish(),
          month: z.number(),
          year: z.number(),
          projectId: z.string().nullish()
        })
      )
      .query(async ({ ctx, input }) => {
        const limit = input.limit ?? 10;
        const { cursor } = input;
        const tasks = await ctx.prisma.task.findMany({
          take: limit + 1,
          where: {
            userId: ctx.user.id,
            yearNumber: input.year,
            ...(input.month !== 12 ? { monthNumber: input.month } : {}),
            ...(input.projectId !== 'allProjects' || input.projectId === null
              ? { projectId: input.projectId }
              : {})
          },
          include: {
            project: {
              select: {
                title: true,
                githubRepoUrl: true
              }
            }
          },
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            id: 'desc'
          }
        });
        let nextCursor: typeof cursor | undefined = undefined;
        if (tasks.length > limit) {
          const nextItem = tasks.pop();
          nextCursor = nextItem?.id;
        }

        return { tasks, nextCursor };
      }),
    getTasksByProject: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          limit: z.number().min(1).max(10).nullish(),
          cursor: z.string().nullish(),
          month: z.number(),
          year: z.number(),
          projectId: z.string().cuid(),
          userId: z.string().nullish()
        })
      )
      .query(async ({ ctx, input }) => {
        const limit = input.limit ?? 10;
        const { cursor } = input;
        const tasks = await ctx.prisma.task.findMany({
          take: limit + 1,
          where: {
            yearNumber: input.year,
            projectId: input.projectId,
            ...(input.month !== 12 ? { monthNumber: input.month } : {}),
            ...(input.userId !== 'allUsers'
              ? { userId: input.userId ?? ctx.user.id }
              : {})
          },
          include: {
            project: {
              select: {
                title: true,
                githubRepoUrl: true
              }
            },
            user: {
              select: {
                name: true
              }
            }
          },
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            id: 'desc'
          }
        });

        let nextCursor: typeof cursor | undefined = undefined;

        if (tasks.length > limit) {
          const nextItem = tasks.pop();
          nextCursor = nextItem?.id;
        }

        const mappedTasks = tasks.map((task) => {
          return {
            ...task,
            isTaskOwner: task.userId === ctx.user.id
          };
        });

        return { tasks: mappedTasks, nextCursor };
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
        });
        return currentTask;
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
        });

        if (!task) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        const finishTime = new Date();

        const durationInSeconds = differenceInSeconds(
          finishTime,
          task.startTime,
          {
            roundingMethod: 'floor'
          }
        );

        const durationObj = intervalToDuration({
          end: finishTime,
          start: task.startTime
        });

        let duration: string;

        if (durationObj.days && durationObj.days > 1) {
          duration = `${durationObj.days} days`;
        } else if (durationObj.days === 1) {
          duration = '1 day';
        } else {
          duration = `${durationObj.hours}:${String(
            durationObj.minutes
          ).padStart(2, '0')}`;
        }

        const updatedTask = await ctx.prisma.task.update({
          where: {
            id: taskId
          },
          data: {
            finishTime,
            duration,
            githubCommitUrl,
            durationInSeconds
          }
        });

        return updatedTask;
      }),
    deleteTask: t.procedure
      .use(authMiddleware(t))
      .input(z.string().cuid())
      .mutation(async ({ ctx, input: taskId }) => {
        const task = await ctx.prisma.task.findUnique({
          where: { id: taskId }
        });
        if (!task) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        } else if (task.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        await ctx.prisma.task.delete({
          where: {
            id: taskId
          }
        });

        return true;
      }),
    editTask: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          taskId: z.string().cuid(),
          title: z.string(),
          description: z.string().nullish(),
          githubCommitUrl: z.string().nullish()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const task = await ctx.prisma.task.findUnique({
          where: {
            id: input.taskId
          }
        });

        if (!task) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        } else if (task.userId !== ctx.user.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        const editedTask = await ctx.prisma.task.update({
          where: {
            id: task.id
          },
          data: {
            title: input.title,
            description: input.description,
            githubCommitUrl: input.githubCommitUrl
          }
        });

        return editedTask;
      })
  });
