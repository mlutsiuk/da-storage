import { z } from 'zod'
import { privateProcedure, router } from '../trpc'

export const locationRouter = router({
  getAll: privateProcedure.query(async ({ ctx }) => {
    return ctx.prisma.location.findMany({
      where: { userId: ctx.auth.id },
      orderBy: { createdAt: 'desc' }
    })
  }),

  create: privateProcedure.input(
    z.object({
      name: z.string().min(1, 'Name is required')
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.location.create({
      data: {
        name: input.name,
        userId: ctx.auth.id
      }
    })
  })
})
