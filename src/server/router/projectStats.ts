import { monthData } from '@/components/statistics/selection/SelectDate';
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
      }),
    getTasksByMonthAndUser: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          year: z.number(),
          projectId: z.string().cuid()
        })
      )
      .query(async ({ ctx, input }) => {
        const groupedTasksByMonthAndUser = await ctx.prisma.task.groupBy({
          where: {
            projectId: input.projectId,
            yearNumber: input.year
          },
          by: ['monthNumber', 'userId'],
          _count: {
            _all: true
          }
        });

        const userNamesById: Record<string, string> = {};

        await Promise.all(
          groupedTasksByMonthAndUser.map(async (task) => {
            if (task.userId) {
              const user = await ctx.prisma.user.findUnique({
                where: {
                  id: task.userId
                },
                select: {
                  name: true
                }
              });
              userNamesById[task.userId] = user?.name ?? 'No name';
            }
          })
        );

        type taskByMonthType = {
          count: number;
          userId: string | undefined | null;
        };

        const numOfTasksByMonth: taskByMonthType[][] = new Array(12).fill([]);

        groupedTasksByMonthAndUser.forEach((groupedTask) => {
          numOfTasksByMonth[groupedTask.monthNumber] = [
            ...numOfTasksByMonth[groupedTask.monthNumber],
            {
              count: groupedTask._count._all ?? 0,
              userId: groupedTask.userId
            }
          ];
        });

        const maxNumberOfUsers = 4;

        for (let i = 0; i < 12; i++) {
          numOfTasksByMonth[i]?.sort((a, b) => b.count - a.count);

          let otherProjectsCount = 0;

          for (let j = maxNumberOfUsers; j < numOfTasksByMonth.length; j++) {
            otherProjectsCount += numOfTasksByMonth[i][j]?.count ?? 0;
          }

          if (numOfTasksByMonth[i].length > maxNumberOfUsers) {
            numOfTasksByMonth[i].splice(
              maxNumberOfUsers,
              numOfTasksByMonth[i].length,
              {
                userId: 'otherUsers',
                count: otherProjectsCount
              }
            );
          }
        }

        type tasksByMonthObjType = {
          [key: string]: string;
        };

        const mappedTasksByMonth: tasksByMonthObjType[] = [];

        numOfTasksByMonth.forEach((tasksByMonth, index) => {
          let tasksByMonthObj: tasksByMonthObjType = {
            month: monthData[index + 1].label
          };

          for (let i = 0; i < tasksByMonth.length; i++) {
            const userId = tasksByMonth[i].userId;
            if (userId && userId !== 'otherUsers') {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                [userNamesById[userId]]: tasksByMonth[i].count.toString()
              };
            } else if (userId === 'otherUsers') {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                'Other users': tasksByMonth[i].count.toString()
              };
            } else {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                'No user': tasksByMonth[i].count.toString()
              };
            }
          }
          mappedTasksByMonth.push(tasksByMonthObj);
        });

        return {
          values: mappedTasksByMonth.filter(
            (month) => Object.keys(month).length > 1
          ),
          keys: [...Object.values(userNamesById), 'Other users', 'No user']
        };
      }),
    getTasksDurationByMonthAndUser: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          projectId: z.string().cuid(),
          year: z.number()
        })
      )
      .query(async ({ ctx, input }) => {
        const groupedTasksByMonthAndUser = await ctx.prisma.task.groupBy({
          where: {
            projectId: input.projectId,
            yearNumber: input.year
          },
          by: ['monthNumber', 'userId'],
          _sum: {
            durationInSeconds: true
          }
        });

        const userNamesById: Record<string, string> = {};

        await Promise.all(
          groupedTasksByMonthAndUser.map(async (task) => {
            if (task.userId) {
              const user = await ctx.prisma.user.findUnique({
                where: {
                  id: task.userId
                },
                select: {
                  name: true
                }
              });
              userNamesById[task.userId] = user?.name ?? 'No name';
            }
          })
        );

        type taskByMonthType = {
          sum: number;
          userId: string | undefined | null;
        };

        const numOfTasksByMonth: taskByMonthType[][] = new Array(12).fill([]);

        groupedTasksByMonthAndUser.forEach((groupedTask) => {
          numOfTasksByMonth[groupedTask.monthNumber] = [
            ...numOfTasksByMonth[groupedTask.monthNumber],
            {
              sum: groupedTask._sum.durationInSeconds ?? 0,
              userId: groupedTask.userId
            }
          ];
        });

        const maxNumberOfUsers = 4;

        for (let i = 0; i < 12; i++) {
          numOfTasksByMonth[i]?.sort((a, b) => b.sum - a.sum);

          let otherUsersCount = 0;

          for (let j = maxNumberOfUsers; j < numOfTasksByMonth.length; j++) {
            otherUsersCount += numOfTasksByMonth[i][j]?.sum ?? 0;
          }

          if (numOfTasksByMonth[i].length > maxNumberOfUsers) {
            numOfTasksByMonth[i].splice(
              maxNumberOfUsers,
              numOfTasksByMonth[i].length,
              {
                userId: 'otherUsers',
                sum: otherUsersCount
              }
            );
          }
        }

        type tasksByMonthObjType = {
          [key: string]: string;
        };

        const mappedTasksByMonth: tasksByMonthObjType[] = [];

        numOfTasksByMonth.forEach((tasksByMonth, index) => {
          let tasksByMonthObj: tasksByMonthObjType = {
            month: monthData[index + 1].label
          };

          for (let i = 0; i < tasksByMonth.length; i++) {
            const userId = tasksByMonth[i].userId;
            if (userId && userId !== 'otherUsers') {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                [userNamesById[userId]]: Math.floor(
                  tasksByMonth[i].sum / 60
                ).toString()
              };
            } else if (userId === 'otherUsers') {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                'Other users': Math.floor(tasksByMonth[i].sum / 60).toString()
              };
            } else {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                'No user': Math.floor(tasksByMonth[i].sum / 60).toString()
              };
            }
          }
          mappedTasksByMonth.push(tasksByMonthObj);
        });

        return {
          values: mappedTasksByMonth.filter(
            (month) => Object.keys(month).length > 1
          ),
          keys: [...Object.values(userNamesById), 'Other users', 'No user']
        };
      })
  });
