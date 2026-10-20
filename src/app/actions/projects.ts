"use server";

import { Project } from '@/types';
import { projectRepository } from '@/repositories/project-repository';
import { revalidatePath } from 'next/cache';

export async function fetchProjectsAction() {
  try {
    return await projectRepository.getProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export async function createProjectAction(project: Project) {
  try {
    const newProject = await projectRepository.createProject(project);
    revalidatePath('/projects');
    return newProject;
  } catch (error) {
    console.error("Failed to create project:", error);
    throw new Error('Failed to create project');
  }
}
