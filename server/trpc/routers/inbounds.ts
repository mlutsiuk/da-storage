import { z } from 'zod'
import { privateProcedure, router } from '../trpc'

export const inboundRouter = router({
  getAll: privateProcedure.input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      sortBy: z.enum(['createdAt', 'trackingCode']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc')
    })
  ).query(async ({ ctx, input }) => {
    const { page, limit, sortBy, sortOrder } = input

    const inbounds = await ctx.prisma.inbound.findMany({
      where: { userId: ctx.auth.id },
      include: {
        location: true
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await ctx.prisma.inbound.count({
      where: { userId: ctx.auth.id }
    })

    return {
      inbounds,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }),

  create: privateProcedure.input(
    z.object({
      trackingCode: z.string().min(4, 'Tracking code is required'),
      locationId: z.string(),
      quantity: z.number().min(1),
      defectiveQuantity: z.number().min(0).default(0)
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.inbound.create({
      data: {
        trackingCode: input.trackingCode,
        quantity: input.quantity,
        defectiveQuantity: input.defectiveQuantity,
        userId: ctx.auth.id,
        locationId: input.locationId
      }
    })
  })
})
