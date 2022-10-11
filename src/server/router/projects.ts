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
            githubRepoUrl: input.githubRepoUrl
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

      return ownProjects
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
      })
  })
