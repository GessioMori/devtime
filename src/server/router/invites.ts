import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { T } from '.'

export const invitesRouter = (t: T) =>
  t.router({
    createInvitation: t.procedure
      .input(
        z.object({
          receiverEmail: z.string(),
          projectId: z.string().cuid()
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.session || !ctx.session.user?.id) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User id not provided.'
          })
        }

        const project = await ctx.prisma.project.findUnique({
          where: {
            id: input.projectId
          }
        })

        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found'
          })
        } else if (project.ownerId !== ctx.session.user.id) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Only project owner can make invitations.'
          })
        }

        const receiver = await ctx.prisma.user.findUnique({
          where: {
            email: input.receiverEmail
          },
          include: {
            invitesReceived: true
          }
        })

        if (!receiver) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found.'
          })
        }

        if (receiver.id === ctx.session.user.id) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You can not invite yourself.'
          })
        }

        const wasAlreadyInvited = receiver.invitesReceived.some(
          (invite) => invite.projectId === input.projectId
        )

        if (wasAlreadyInvited) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'User already invited.'
          })
        }

        const newInvite = await ctx.prisma.projectInvites.create({
          data: {
            receiverId: receiver.id,
            projectId: input.projectId
          }
        })

        return newInvite
      }),

    listReceivedInvitations: t.procedure.query(async ({ ctx }) => {
      if (!ctx.session || !ctx.session.user?.id) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const invitations = await ctx.prisma.projectInvites.findMany({
        where: {
          receiverId: ctx.session.user.id,
          status: 'PENDING'
        },
        include: {
          project: true
        }
      })

      return invitations
    }),
    handleInvitation: t.procedure
      .input(
        z.object({
          inviteId: z.string().cuid(),
          status: z.enum(['ACCEPTED', 'REJECTED'])
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.session || !ctx.session.user?.id) {
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        const invite = await ctx.prisma.projectInvites.findUnique({
          where: {
            id: input.inviteId
          }
        })

        if (!invite) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }

        await ctx.prisma.usersOnProjects.create({
          data: {
            projectId: invite.projectId,
            userId: ctx.session.user.id
          }
        })

        const updatedInvite = await ctx.prisma.projectInvites.update({
          where: {
            id: invite.id
          },
          data: {
            status: input.status
          }
        })

        return updatedInvite
      })
  })
