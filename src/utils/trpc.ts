import type { AppRouter } from '@/server/router/index';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import superjson from 'superjson';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false
          }
        }
      },
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers() {
            if (ctx?.req) {
              const { ...headers } = ctx.req.headers;
              return {
                ...headers,
                'x-ssr': '1'
              };
            }
            return {};
          }
        })
      ]
    };
  },
  ssr: true
});
