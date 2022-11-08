import { trpc } from '@/utils/trpc';
import { Select } from '@mantine/core';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';

export type SelectProjectProps = {
  projectId: string | null;
  setProjectId: Dispatch<SetStateAction<string | null>>;
  projectSelectStyles?: Record<string, string>;
};

export const SelectProject: FunctionComponent<SelectProjectProps> = ({
  projectId,
  setProjectId,
  projectSelectStyles
}) => {
  const { data: projectsData, isLoading: isLoadingProjects } =
    trpc.projects.listProjects.useQuery();

  const getProjectsList = () => {
    if (projectsData) {
      const formatedProjects = projectsData
        .map((project) => {
          return {
            value: project.id,
            label: project.title
          };
        })
        .sort((a, b) => a.label.localeCompare(b.label));

      formatedProjects.unshift({ value: 'allProjects', label: 'All projects' });

      return formatedProjects;
    }

    return [];
  };

  return (
    <Select
      placeholder={
        isLoadingProjects ? 'Loading your projects...' : 'Choose a project'
      }
      onChange={setProjectId}
      value={projectId}
      data={getProjectsList()}
      sx={projectSelectStyles}
    />
  );
};
