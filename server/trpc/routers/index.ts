import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { authRouter } from './auth'
import { itemsRouter } from './items'
import { inboundRouter } from './inbounds'
import { locationRouter } from './locations'

export const appRouter = router({
  auth: authRouter,
  items: itemsRouter,
  inbound: inboundRouter,
  locations: locationRouter,

  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish()
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? 'world'}`
      }
    })
})

// export type definition of API
export type AppRouter = typeof appRouter
