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
      })
  })
