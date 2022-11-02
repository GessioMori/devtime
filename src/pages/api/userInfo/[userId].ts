import { prisma } from '@/server/db/client';
import { getScreenshot } from '@/utils/lib/chromium';
import { generateUserCard } from '@/utils/userCardGenerator';
import cache from 'memory-cache';
import { NextApiRequest, NextApiResponse } from 'next';

const isDev = !process.env.AWS_REGION;

export default async function cachedHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.userId;

  if (!userId || typeof userId !== 'string') {
    return res.status(404).json({ message: 'User not found' });
  }

  const cachedResponse = cache.get(userId);

  if (cachedResponse) {
    return res.setHeader('Content-Type', 'image/png').end(cachedResponse);
  } else {
    const hours = 24;
    const html = await getUserInfo(userId);
    const file = await getScreenshot(html, isDev);
    cache.put(userId, file, hours * 60 * 60);
    return res.setHeader('Content-Type', 'image/png').end(file);
  }
}

async function getUserInfo(userId: string) {
  const user = await prisma?.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const groupedTasks = await prisma?.task.groupBy({
    where: {
      userId: user.id
    },
    by: ['projectId'],
    _sum: {
      durationInSeconds: true
    }
  });

  const tasks = await prisma?.task.aggregate({
    where: {
      userId: user.id
    },
    _count: {
      _all: true
    },
    _sum: {
      durationInSeconds: true
    }
  });

  const projects = await prisma?.usersOnProjects.findMany({
    where: {
      userId: user.id
    },
    include: {
      project: {
        select: {
          title: true
        }
      }
    }
  });

  let mainProjectId = '';
  let mainProject = '';
  const workingTime = tasks?._sum.durationInSeconds ?? 0;
  const numberOfCompletedTasks = tasks?._count._all;
  const numberOfProjects = projects?.length;

  if (groupedTasks && projects) {
    mainProjectId =
      groupedTasks.reduce((prev, curr) =>
        (prev._sum.durationInSeconds ?? 0) > (curr._sum.durationInSeconds ?? 0)
          ? prev
          : curr
      ).projectId ?? '';
    if (mainProjectId) {
    }
    mainProject =
      projects.find((project) => project.projectId === mainProjectId)?.project
        .title ?? '';
  }

  return generateUserCard({
    mainProject,
    projects: numberOfProjects,
    tasks: numberOfCompletedTasks,
    workingTimeInSeconds: workingTime
  });
}
