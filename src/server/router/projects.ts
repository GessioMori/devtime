import { prisma } from '@/server/db/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { T } from '.'

export const projectsRouter = (t: T) =>
  t.router({
    createProject: t.procedure
      .input(
        z.object({
          title: z.string().min(5),
          description: z.string().optional(),
          githubRepoUrl: z.string().url().optional()
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.session || !ctx.session.user?.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        const newProject = await ctx.prisma.project.create({
          data: {
            title: input.title,
            ownerId: ctx.session.user?.id,
            description: input.description,
            githubRepoUrl: input.githubRepoUrl,

            users: {
              create: [
                {
                  userId: ctx.session.user.id,
                  isOwner: true
                }
              ]
            }
          }
        })
        return newProject
      }),
    listProjects: t.procedure.query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const allProjects = await ctx.prisma.project.findMany({
        where: {
          users: {
            some: {
              userId: ctx.session.user.id
            }
          }
        }
      })

      const mappedProjects = allProjects.map((project) => {
        return {
          ...project,
          isProjectOwner: project.ownerId === ctx.session?.user?.id
        }
      })

      return mappedProjects
    }),
    listOwnProjects: t.procedure.query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const projects = await ctx.prisma.project.findMany({
        where: {
          ownerId: ctx.session.user.id
        }
      })

      return projects
    }),
    deleteProject: t.procedure
      .input(z.string().cuid())
      .mutation(async ({ ctx, input: projectId }) => {
        if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }
        const project = await ctx.prisma.project.findUnique({
          where: { id: projectId }
        })
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        } else if (project.ownerId !== ctx.session.user.id) {
          throw new TRPCError({ code: 'FORBIDDEN' })
        }

        await ctx.prisma.project.delete({
          where: {
            id: projectId
          }
        })

        return true
      }),
    getProject: t.procedure
      .input(z.string().cuid())
      .query(async ({ ctx, input: projectId }) => {
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            users: {
              include: {
                user: true
              }
            },
            tasks: true
          }
        })
        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }

        const mappedProject = {
          ...project,
          tasks: project.tasks.map((task) => {
            return {
              ...task,
              taskOwnerName: project.users.find(
                (user) => user.user.id === task.userId
              )?.user.name,
              isTaskOwner: task.userId === ctx.session?.user?.id
            }
          }),
          isProjectOwner: project.ownerId === ctx.session?.user?.id,
          users: project.users.map((user) => {
            return {
              isProjectOwner: user.isOwner,
              asignedAt: user.assignedAt,
              ...user.user
            }
          })
        }
        return mappedProject
      }),
    leaveProject: t.procedure
      .input(
        z.object({
          projectId: z.string().cuid()
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        const project = await ctx.prisma.project.findUnique({
          where: {
            id: input.projectId
          }
        })

        if (!project) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }
        if (project.ownerId === ctx.session.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'The owner can not leave a project, delete it instead.'
          })
        }

        await ctx.prisma.usersOnProjects.delete({
          where: {
            userId_projectId: {
              projectId: project.id,
              userId: ctx.session.user.id
            }
          }
        })

        const invite = await ctx.prisma.projectInvites.findFirst({
          where: {
            projectId: project.id,
            receiverId: ctx.session.user.id
          }
        })

        await ctx.prisma.projectInvites.delete({
          where: {
            id: invite?.id
          }
        })

        return true
      })
  })
