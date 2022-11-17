import { prisma } from '@/server/db/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { T } from '.';
import { authMiddleware } from './middleware';

export const projectsRouter = (t: T) =>
  t.router({
    createProject: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          title: z.string().min(5),
          description: z.string().optional(),
          githubRepoUrl: z.string().url().optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const newProject = await ctx.prisma.project.create({
          data: {
            title: input.title,
            ownerId: ctx.user.id,
            description: input.description,
            githubRepoUrl: input.githubRepoUrl,

            users: {
              create: [
                {
                  userId: ctx.user.id,
                  isOwner: true
                }
              ]
            }
          }
        });
        return newProject;
      }),
    listProjects: t.procedure.use(authMiddleware(t)).query(async ({ ctx }) => {
      const allProjects = await ctx.prisma.project.findMany({
        where: {
          users: {
            some: {
              userId: ctx.user.id
            }
          }
        }
      });

      const mappedProjects = allProjects.map((project) => {
        return {
          ...project,
          isProjectOwner: project.ownerId === ctx.user.id
        };
      });

      return mappedProjects;
    }),
    listPaginatedProjects: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          limit: z.number().min(1).max(10).nullish(),
          cursor: z.string().nullish()
        })
      )
      .query(async ({ input, ctx }) => {
        const limit = input.limit ?? 10;
        const { cursor } = input;
        const allProjects = await ctx.prisma.project.findMany({
          take: limit + 1,
          where: {
            users: {
              some: {
                userId: ctx.user.id
              }
            }
          },
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            id: 'desc'
          }
        });

        let nextCursor: typeof cursor | undefined = undefined;

        if (allProjects.length > limit) {
          const nextItem = allProjects.pop();
          nextCursor = nextItem?.id;
        }

        const mappedProjects = allProjects.map((project) => {
          return {
            ...project,
            isProjectOwner: project.ownerId === ctx.user.id
          };
        });

        return { projects: mappedProjects, nextCursor };
      }),
    listOwnProjects: t.procedure
      .use(authMiddleware(t))
      .query(async ({ ctx }) => {
        const projects = await ctx.prisma.project.findMany({
          where: {
            ownerId: ctx.user.id
          }
        });

        return projects;
      }),
    deleteProject: t.procedure
      .use(authMiddleware(t))
      .input(z.string().cuid())
      .mutation(async ({ ctx, input: projectId }) => {
        const project = await ctx.prisma.project.findUnique({
          where: { id: projectId }
        });
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        } else if (project.ownerId !== ctx.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }

        await ctx.prisma.project.delete({
          where: {
            id: projectId
          }
        });

        return true;
      }),
    getProject: t.procedure
      .use(authMiddleware(t))
      .input(z.string().cuid())
      .query(async ({ ctx, input: projectId }) => {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            users: {
              include: {
                user: true
              },
              orderBy: {
                isOwner: 'desc'
              }
            }
          }
        });

        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        const mappedProject = {
          ...project,
          isProjectOwner: project.ownerId === ctx.user.id,
          users: project.users.map((user) => {
            return {
              isProjectOwner: user.isOwner,
              assignedAt: user.assignedAt,
              ...user.user
            };
          })
        };
        return mappedProject;
      }),
    leaveProject: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          projectId: z.string().cuid()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const project = await ctx.prisma.project.findUnique({
          where: {
            id: input.projectId
          }
        });

        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }
        if (project.ownerId === ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'The owner can not leave a project, delete it instead.'
          });
        }

        await ctx.prisma.usersOnProjects.delete({
          where: {
            userId_projectId: {
              projectId: project.id,
              userId: ctx.user.id
            }
          }
        });

        await ctx.prisma.projectInvites.delete({
          where: {
            receiverId_projectId: {
              projectId: project.id,
              receiverId: ctx.user.id
            }
          }
        });

        await ctx.prisma.task.updateMany({
          where: {
            projectId: project.id,
            userId: ctx.user.id
          },
          data: {
            projectId: null
          }
        });

        return true;
      }),
    removeUserFromProject: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          projectId: z.string().cuid(),
          userId: z.string().cuid()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const project = await ctx.prisma.project.findUnique({
          where: {
            id: input.projectId
          },
          include: {
            users: true
          }
        });

        if (
          !project ||
          !project.users.some((user) => user.userId === input.userId)
        ) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        }

        if (project.ownerId === input.userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'The owner can not leave a project, delete it instead.'
          });
        }

        await ctx.prisma.usersOnProjects.delete({
          where: {
            userId_projectId: {
              projectId: project.id,
              userId: input.userId
            }
          }
        });

        await ctx.prisma.projectInvites.delete({
          where: {
            receiverId_projectId: {
              projectId: project.id,
              receiverId: input.userId
            }
          }
        });

        await ctx.prisma.task.updateMany({
          where: {
            projectId: project.id,
            userId: input.userId
          },
          data: {
            projectId: null
          }
        });

        return true;
      }),
    editProject: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          projectId: z.string().cuid(),
          title: z.string(),
          description: z.string().nullish(),
          githubRepoUrl: z.string().nullish()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const project = await ctx.prisma.project.findUnique({
          where: {
            id: input.projectId
          }
        });

        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' });
        } else if (project.ownerId !== ctx.user.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' });
        }

        const editedProject = await ctx.prisma.project.update({
          where: {
            id: project.id
          },
          data: {
            title: input.title,
            description: input.description,
            githubRepoUrl: input.githubRepoUrl
          }
        });

        return editedProject;
      })
  });
