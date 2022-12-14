import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { authRouter } from './auth';
import { Context } from './context';
import { githubRouter } from './github';
import { invitesRouter } from './invites';
import { projectsRouter } from './projects';
import { projectStatisticsRouter } from './projectStats';
import { tasksRouter } from './tasks';
import { tasksStatisticsRouter } from './tasksStats';

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null
      }
    };
  },
  transformer: superjson
});

export type T = typeof t;

export const appRouter = t.router({
  auth: t.mergeRouters(authRouter(t)),
  tasks: t.mergeRouters(tasksRouter(t)),
  github: t.mergeRouters(githubRouter(t)),
  projects: t.mergeRouters(projectsRouter(t)),
  invites: t.mergeRouters(invitesRouter(t)),
  tasksStats: t.mergeRouters(tasksStatisticsRouter(t)),
  projectStats: t.mergeRouters(projectStatisticsRouter(t))
});

export type AppRouter = typeof appRouter;
