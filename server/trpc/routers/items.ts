import { z } from 'zod'
import { privateProcedure, router } from '../trpc'

export const itemsRouter = router({
  getAll: privateProcedure.input(
    z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      sortBy: z.enum(['createdAt', 'name']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc')
    })
  ).query(async ({ ctx, input }) => {
    const { page, limit, sortBy, sortOrder } = input
  
    const items = await ctx.prisma.item.findMany({
      where: { userId: ctx.auth.id },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit
    })
  
    const total = await ctx.prisma.item.count({
      where: { userId: ctx.auth.id }
    })
  
    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  }),

  create: privateProcedure.input(
    z.object({
      name: z.string().min(1, 'Name is required')
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.item.create({
      data: {
        name: input.name,
        userId: ctx.auth.id
      }
    })
  })
})
