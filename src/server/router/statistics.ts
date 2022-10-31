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
            ...(input.month !== 12 ? { monthNumber: input.month } : {}),
            ...(input.year !== 0 ? { yearNumber: input.year } : {})
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
            ...(input.month !== 12 ? { monthNumber: input.month } : {}),
            ...(input.year !== 0 ? { yearNumber: input.year } : {})
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
      })
  });
