import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { T } from '.'
import { authMiddleware } from './middleware'

export const invitesRouter = (t: T) =>
  t.router({
    createInvitation: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          receiverEmail: z.string(),
          projectId: z.string().cuid()
        })
      )
      .mutation(async ({ ctx, input }) => {
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
        } else if (project.ownerId !== ctx.user.id) {
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

        if (receiver.id === ctx.user.id) {
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

    listReceivedInvitations: t.procedure
      .use(authMiddleware(t))
      .query(async ({ ctx }) => {
        const invitations = await ctx.prisma.projectInvites.findMany({
          where: {
            receiverId: ctx.user.id,
            status: 'PENDING'
          },
          include: {
            project: true
          }
        })

        return invitations
      }),
    handleInvitation: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          projectId: z.string().cuid(),
          status: z.enum(['ACCEPTED', 'REJECTED'])
        })
      )
      .mutation(async ({ ctx, input }) => {
        const invite = await ctx.prisma.projectInvites.findUnique({
          where: {
            receiverId_projectId: {
              projectId: input.projectId,
              receiverId: ctx.user.id
            }
          }
        })

        if (!invite) {
          throw new TRPCError({ code: 'NOT_FOUND' })
        }

        if (input.status === 'ACCEPTED') {
          await ctx.prisma.usersOnProjects.create({
            data: {
              projectId: invite.projectId,
              userId: ctx.user.id
            }
          })
        }

        const updatedInvite = await ctx.prisma.projectInvites.update({
          where: {
            receiverId_projectId: {
              projectId: invite.projectId,
              receiverId: invite.receiverId
            }
          },
          data: {
            status: input.status
          }
        })

        return updatedInvite
      }),
    getDeniedInvites: t.procedure
      .use(authMiddleware(t))
      .query(async ({ ctx }) => {
        const deniedInvites = await ctx.prisma.projectInvites.findMany({
          where: {
            receiverId: ctx.user.id,
            status: 'REJECTED'
          },
          include: {
            project: {
              select: {
                id: true,
                title: true
              }
            }
          }
        })

        return deniedInvites
      }),
    cancelDeniedInvite: t.procedure
      .use(authMiddleware(t))
      .input(
        z.object({
          projectId: z.string().cuid()
        })
      )
      .mutation(async ({ ctx, input }) => {
        const removedInvite = await ctx.prisma.projectInvites.delete({
          where: {
            receiverId_projectId: {
              receiverId: ctx.user.id,
              projectId: input.projectId
            }
          }
        })

        return removedInvite
      })
  })
