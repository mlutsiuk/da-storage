/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson
})

/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use((opts) => {
  if (!opts.ctx.auth) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User is not authenticated'
    })
  }

  return opts.next({
    ctx: {
      auth: opts.ctx.auth
    }
  })
})
export const router = t.router
export const middleware = t.middleware
