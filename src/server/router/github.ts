import { z } from 'zod';
import { T } from '.';
import { authMiddleware } from './middleware';

interface Repository {
  id: string;
  url: string;
  language: string;
  name: string;
  svn_url: string;
}

interface Commit {
  commit: {
    message?: string;
    author: {
      date: Date;
      email: string;
      name: string;
    };
  };
  html_url: string;
}

export const githubRouter = (t: T) =>
  t.router({
    getUserRepositories: t.procedure
      .use(authMiddleware(t))
      .query(async ({ ctx }) => {
        const repositories = await fetch(
          `https://api.github.com/user/${ctx.user.githubId}/repos`
        )
          .then((res) => res.json())
          .then((repos: Repository[]) =>
            repos.map((repo) => {
              return {
                id: repo.id,
                url: repo.svn_url,
                language: repo.language,
                name: repo.name
              };
            })
          );

        return {
          repositories
        };
      }),
    getLastCommits: t.procedure
      .input(z.string())
      .query(async ({ input: repoUrl }) => {
        if (repoUrl === '') {
          return null;
        }
        const repositoryName = repoUrl.split('github.com')[1];
        const url = `https://api.github.com/repos${repositoryName}/commits?page=1&per_page=50`;
        const commits: Commit[] = await fetch(url).then((res) => res.json());

        if (!commits) {
          return null;
        }

        const mappedCommits = commits.map((commitData) => {
          return {
            message: commitData.commit.message,
            date: commitData.commit.author.date,
            email: commitData.commit.author.email,
            name: commitData.commit.author.name,
            html_url: commitData.html_url
          };
        });

        return mappedCommits;
      })
  });
