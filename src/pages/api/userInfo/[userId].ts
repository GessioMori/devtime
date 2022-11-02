import { prisma } from '@/server/db/client';
import cache from 'memory-cache';
import { NextApiRequest, NextApiResponse } from 'next';

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
    return res.status(200).json(cachedResponse);
  } else {
    const hours = 24;
    await getUserInfo(userId)
      .then((data) => {
        cache.put(userId, data, hours * 1000 * 60 * 60);
        return res.status(200).json(data);
      })
      .catch((err) => res.status(400).json({ message: err.message }));
  }
}

async function getUserInfo(userId: string) {
  const user = await prisma?.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) {
    throw new Error('here');
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

  let mostDedicatedProjectId = '';
  let mostDedicatedProjectTitle = '';
  const durationOfCompletedTasks = tasks?._sum.durationInSeconds;
  const numberOfCompletedTasks = tasks?._count._all;
  const numberOfProjects = projects?.length;

  if (groupedTasks && projects) {
    mostDedicatedProjectId =
      groupedTasks.reduce((prev, curr) =>
        (prev._sum.durationInSeconds ?? 0) > (curr._sum.durationInSeconds ?? 0)
          ? prev
          : curr
      ).projectId ?? '';
    if (mostDedicatedProjectId) {
    }
    mostDedicatedProjectTitle =
      projects.find((project) => project.projectId === mostDedicatedProjectId)
        ?.project.title ?? '';
  }

  return {
    name: user.name,
    mostDedicatedProjectTitle,
    durationOfCompletedTasks,
    numberOfCompletedTasks,
    numberOfProjects
  };
}
