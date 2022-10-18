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

      const ownProjects = await ctx.prisma.project.findMany({
        where: {
          ownerId: ctx.session.user.id
        }
      })

      const allProjects = await ctx.prisma.project.findMany({
        where: {
          users: {
            some: {
              userId: ctx.session.user.id
            }
          }
        }
      })

      return allProjects
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
              ownerName: project.users.find(
                (user) => user.user.id === task.userId
              )?.user.name,
              isOwner: task.userId === ctx.session?.user?.id
            }
          }),
          isProjectOwner: project.ownerId === ctx.session?.user?.id
        }
        return mappedProject
      })
  })
