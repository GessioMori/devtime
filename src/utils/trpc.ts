import type { AppRouter } from '@/server/router/index'
import { httpBatchLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`

  return `http://localhost:${process.env.PORT ?? 3000}`
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            //refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false
          }
        }
      },
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              const { connection: _connection, ...headers } = ctx.req.headers
              return {
                ...headers,
                'x-ssr': '1'
              }
            }
            return {}
          }
        })
      ]
    }
  },
  ssr: true
})
