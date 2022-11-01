import { monthData } from '@/components/statistics/selection/SelectDate';
import { z } from 'zod';
import { T } from '.';
import { authMiddleware } from './middleware';

export const statisticsRouter = (t: T) =>
  t.router({
    countTasks: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          month: z.number(),
          year: z.number()
        })
      )
      .query(async ({ ctx, input }) => {
        const groupedTasksByProject = await ctx.prisma.task.groupBy({
          where: {
            userId: ctx.user.id,
            yearNumber: input.year,
            ...(input.month !== 12 ? { monthNumber: input.month } : {})
          },
          by: ['projectId'],
          _count: {
            _all: true
          }
        });

        if (!groupedTasksByProject || groupedTasksByProject.length === 0) {
          return null;
        }

        const groupedTasksWithProjectName = await Promise.all(
          groupedTasksByProject.map(async (task) => {
            if (task.projectId) {
              const projectInfo = await ctx.prisma.project.findUnique({
                where: { id: task.projectId }
              });
              return {
                id: task.projectId,
                label: projectInfo?.title || 'No label',
                value: task._count._all
              };
            }
            return {
              id: 'noProject',
              label: 'No project',
              value: task._count._all
            };
          })
        );

        const maxNumberOfProjects = 8;

        const groupedTasks = groupedTasksWithProjectName.sort(
          (a, b) => b.value - a.value
        );

        let otherProjectsCount = 0;

        for (let i = maxNumberOfProjects; i < groupedTasks.length; i++) {
          otherProjectsCount += groupedTasks[i]?.value ?? 0;
        }

        if (groupedTasks.length > maxNumberOfProjects) {
          groupedTasks.splice(maxNumberOfProjects, groupedTasks.length, {
            id: 'otherProjects',
            label: 'Other projects',
            value: otherProjectsCount
          });
        }

        return groupedTasks;
      }),
    countTasksTime: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          month: z.number(),
          year: z.number()
        })
      )
      .query(async ({ ctx, input }) => {
        const groupedTasksByProject = await ctx.prisma.task.groupBy({
          where: {
            userId: ctx.user.id,
            yearNumber: input.year,
            ...(input.month !== 12 ? { monthNumber: input.month } : {})
          },
          by: ['projectId'],
          _sum: {
            durationInSeconds: true
          }
        });

        if (!groupedTasksByProject || groupedTasksByProject.length === 0) {
          return null;
        }

        const groupedTasksWithProjectName = await Promise.all(
          groupedTasksByProject.map(async (task) => {
            if (task.projectId) {
              const projectInfo = await ctx.prisma.project.findUnique({
                where: { id: task.projectId }
              });
              return {
                id: task.projectId,
                label: projectInfo?.title || 'No label',
                value: task._sum.durationInSeconds
                  ? Math.floor(task._sum.durationInSeconds / 60)
                  : 0
              };
            }
            return {
              id: 'noProject',
              label: 'No project',
              value: task._sum.durationInSeconds
                ? Math.floor(task._sum.durationInSeconds / 60)
                : 0
            };
          })
        );

        const maxNumberOfProjects = 8;

        const groupedTasks = groupedTasksWithProjectName.sort(
          (a, b) => b.value - a.value
        );

        let otherProjectsCount = 0;

        for (let i = maxNumberOfProjects; i < groupedTasks.length; i++) {
          otherProjectsCount += groupedTasks[i]?.value ?? 0;
        }

        if (groupedTasks.length > maxNumberOfProjects) {
          groupedTasks.splice(maxNumberOfProjects, groupedTasks.length, {
            id: 'otherProjects',
            label: 'Other projects',
            value: otherProjectsCount
          });
        }

        return groupedTasks;
      }),
    getTasksByMonth: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          year: z.number()
        })
      )
      .query(async ({ ctx, input }) => {
        const groupedTasksByMonthAndProject = await ctx.prisma.task.groupBy({
          where: {
            userId: ctx.user.id,
            yearNumber: input.year
          },
          by: ['monthNumber', 'projectId'],
          _count: {
            _all: true
          }
        });

        const projectNamesById: Record<string, string> = {};

        await Promise.all(
          groupedTasksByMonthAndProject.map(async (task) => {
            if (task.projectId) {
              const project = await ctx.prisma.project.findUnique({
                where: {
                  id: task.projectId
                },
                select: {
                  title: true
                }
              });
              projectNamesById[task.projectId] = project?.title ?? 'No title';
            }
          })
        );

        type taskByMonthType = {
          count: number;
          projectId: string | undefined | null;
        };

        const numOfTasksByMonth: taskByMonthType[][] = new Array(12).fill([]);

        groupedTasksByMonthAndProject.forEach((groupedTask) => {
          numOfTasksByMonth[groupedTask.monthNumber] = [
            ...numOfTasksByMonth[groupedTask.monthNumber],
            {
              count: groupedTask._count._all ?? 0,
              projectId: groupedTask.projectId
            }
          ];
        });

        const maxNumberOfProjects = 4;

        for (let i = 0; i < 12; i++) {
          numOfTasksByMonth[i]?.sort((a, b) => b.count - a.count);

          let otherProjectsCount = 0;

          for (let j = maxNumberOfProjects; j < numOfTasksByMonth.length; j++) {
            otherProjectsCount += numOfTasksByMonth[i][j]?.count ?? 0;
          }

          if (numOfTasksByMonth[i].length > maxNumberOfProjects) {
            numOfTasksByMonth[i].splice(
              maxNumberOfProjects,
              numOfTasksByMonth[i].length,
              {
                projectId: 'otherProjects',
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
            const projId = tasksByMonth[i].projectId;
            if (projId && projId !== 'otherProjects') {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                [projectNamesById[projId]]: tasksByMonth[i].count.toString()
              };
            } else if (projId === 'otherProjects') {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                'Other projects': tasksByMonth[i].count.toString()
              };
            } else {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                'No project': tasksByMonth[i].count.toString()
              };
            }
          }
          mappedTasksByMonth.push(tasksByMonthObj);
        });

        return {
          values: mappedTasksByMonth.filter(
            (month) => Object.keys(month).length > 1
          ),
          keys: [
            ...Object.values(projectNamesById),
            'Other projects',
            'No project'
          ]
        };
      }),
    getTasksDurationByMonth: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          year: z.number()
        })
      )
      .query(async ({ ctx, input }) => {
        const groupedTasksByMonthAndProject = await ctx.prisma.task.groupBy({
          where: {
            userId: ctx.user.id,
            yearNumber: input.year
          },
          by: ['monthNumber', 'projectId'],
          _sum: {
            durationInSeconds: true
          }
        });

        const projectNamesById: Record<string, string> = {};

        await Promise.all(
          groupedTasksByMonthAndProject.map(async (task) => {
            if (task.projectId) {
              const project = await ctx.prisma.project.findUnique({
                where: {
                  id: task.projectId
                },
                select: {
                  title: true
                }
              });
              projectNamesById[task.projectId] = project?.title ?? 'No title';
            }
          })
        );

        type taskByMonthType = {
          sum: number;
          projectId: string | undefined | null;
        };

        const numOfTasksByMonth: taskByMonthType[][] = new Array(12).fill([]);

        groupedTasksByMonthAndProject.forEach((groupedTask) => {
          numOfTasksByMonth[groupedTask.monthNumber] = [
            ...numOfTasksByMonth[groupedTask.monthNumber],
            {
              sum: groupedTask._sum.durationInSeconds ?? 0,
              projectId: groupedTask.projectId
            }
          ];
        });

        const maxNumberOfProjects = 4;

        for (let i = 0; i < 12; i++) {
          numOfTasksByMonth[i]?.sort((a, b) => b.sum - a.sum);

          let otherProjectsCount = 0;

          for (let j = maxNumberOfProjects; j < numOfTasksByMonth.length; j++) {
            otherProjectsCount += numOfTasksByMonth[i][j]?.sum ?? 0;
          }

          if (numOfTasksByMonth[i].length > maxNumberOfProjects) {
            numOfTasksByMonth[i].splice(
              maxNumberOfProjects,
              numOfTasksByMonth[i].length,
              {
                projectId: 'otherProjects',
                sum: otherProjectsCount
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
            const projId = tasksByMonth[i].projectId;
            if (projId && projId !== 'otherProjects') {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                [projectNamesById[projId]]: Math.floor(
                  tasksByMonth[i].sum / 60
                ).toString()
              };
            } else if (projId === 'otherProjects') {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                'Other projects': Math.floor(
                  tasksByMonth[i].sum / 60
                ).toString()
              };
            } else {
              tasksByMonthObj = {
                ...tasksByMonthObj,
                'No project': Math.floor(tasksByMonth[i].sum / 60).toString()
              };
            }
          }
          mappedTasksByMonth.push(tasksByMonthObj);
        });

        return {
          values: mappedTasksByMonth.filter(
            (month) => Object.keys(month).length > 1
          ),
          keys: [
            ...Object.values(projectNamesById),
            'Other projects',
            'No project'
          ]
        };
      })
  });
