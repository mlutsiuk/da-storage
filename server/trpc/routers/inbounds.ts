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
      subTrackingCode: z.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.inbound.create({
      data: {
        trackingCode: input.trackingCode,
        subTrackingCode: input.subTrackingCode,
        userId: ctx.auth.id,
      }
    })
  }),

  getCountByTrackingCode: privateProcedure.input(
    z.object({
      trackingCode: z.string().min(4, 'Tracking code is required')
    })
  ).query(async ({ ctx, input }) => {
    const count = await ctx.prisma.inbound.count({
      where: {
        trackingCode: input.trackingCode,
        userId: ctx.auth.id
      }
    })
    return { count }
  }),
  
  getByTrackingCode: privateProcedure.input(
    z.object({
      trackingCode: z.string().min(4, 'Tracking code is required')
    })
  ).query(async ({ ctx, input }) => {
    return ctx.prisma.inbound.findMany({
      where: {
        trackingCode: input.trackingCode,
        userId: ctx.auth.id
      }
    })
  }),

  delete: privateProcedure.input(
    z.object({ id: z.string().uuid() })
  ).mutation(async ({ ctx, input }) => {
    await ctx.prisma.inbound.delete({
      where: {
        id: input.id,
        userId: ctx.auth.id
      }
    })
    return { success: true }
  })
})
