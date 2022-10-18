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
          throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        const receiverInfo = await ctx.prisma.user.findFirst({
          where: {
            email: input.receiverEmail
          }
        })

        if (!receiverInfo) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }

        const newInvite = await ctx.prisma.projectInvites.create({
          data: {
            senderId: ctx.session.user.id,
            receiverId: receiverInfo.id,
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
          receiverId: ctx.session.user.id
        },
        include: {
          project: true,
          receiver: true
        }
      })

      return invitations
    })
  })
