import { z } from 'zod';
import { T } from '.';
import { authMiddleware } from './middleware';

export const projectStatisticsRouter = (t: T) =>
  t.router({
    countTasksByProject: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          projectId: z.string().cuid(),
          month: z.number(),
          year: z.number()
        })
      )
      .query(async ({ ctx, input }) => {
        const groupedTasksByUser = await ctx.prisma.task.groupBy({
          where: {
            projectId: input.projectId,
            yearNumber: input.year,
            ...(input.month !== 12 ? { monthNumber: input.month } : {})
          },
          by: ['userId'],
          _count: {
            _all: true
          }
        });

        if (!groupedTasksByUser || groupedTasksByUser.length === 0) {
          return null;
        }

        const groupedTasksWithUserName = await Promise.all(
          groupedTasksByUser.map(async (task) => {
            if (task.userId) {
              const userInfo = await ctx.prisma.user.findUnique({
                where: { id: task.userId }
              });
              return {
                id: task.userId,
                label: userInfo?.name || 'No name',
                value: task._count._all
              };
            }
            return {
              id: 'noUser',
              label: 'No user',
              value: task._count._all
            };
          })
        );

        const maxNumberOfUsers = 8;

        const groupedTasks = groupedTasksWithUserName.sort(
          (a, b) => b.value - a.value
        );

        let otherUsersCount = 0;

        for (let i = maxNumberOfUsers; i < groupedTasks.length; i++) {
          otherUsersCount += groupedTasks[i]?.value ?? 0;
        }

        if (groupedTasks.length > maxNumberOfUsers) {
          groupedTasks.splice(maxNumberOfUsers, groupedTasks.length, {
            id: 'otherUsers',
            label: 'Other users',
            value: otherUsersCount
          });
        }

        return groupedTasks;
      }),
    countTasksDurationByProject: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          projectId: z.string().cuid(),
          month: z.number(),
          year: z.number()
        })
      )
      .query(async ({ ctx, input }) => {
        const groupedTasksByUser = await ctx.prisma.task.groupBy({
          where: {
            projectId: input.projectId,
            yearNumber: input.year,
            ...(input.month !== 12 ? { monthNumber: input.month } : {})
          },
          by: ['userId'],
          _sum: {
            durationInSeconds: true
          }
        });

        if (!groupedTasksByUser || groupedTasksByUser.length === 0) {
          return null;
        }

        const groupedTasksWithUserName = await Promise.all(
          groupedTasksByUser.map(async (task) => {
            if (task.userId) {
              const userInfo = await ctx.prisma.user.findUnique({
                where: { id: task.userId }
              });
              return {
                id: task.userId,
                label: userInfo?.name || 'No name',
                value: task._sum.durationInSeconds
                  ? Math.floor(task._sum.durationInSeconds / 60)
                  : 0
              };
            }
            return {
              id: 'noUser',
              label: 'No user',
              value: task._sum.durationInSeconds
                ? Math.floor(task._sum.durationInSeconds / 60)
                : 0
            };
          })
        );

        const maxNumberOfUsers = 8;

        const groupedTasks = groupedTasksWithUserName.sort(
          (a, b) => b.value - a.value
        );

        let otherUsersCount = 0;

        for (let i = maxNumberOfUsers; i < groupedTasks.length; i++) {
          otherUsersCount += groupedTasks[i]?.value;
        }

        if (groupedTasks.length > maxNumberOfUsers) {
          groupedTasks.splice(maxNumberOfUsers, groupedTasks.length, {
            id: 'otherUsers',
            label: 'Other users',
            value: otherUsersCount
          });
        }

        return groupedTasks;
      })
  });
