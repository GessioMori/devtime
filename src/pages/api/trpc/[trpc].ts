import { appRouter } from '@/server/router'
import { createContext } from '@/server/router/context'
import * as trpcNext from '@trpc/server/adapters/next'

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext
})
