"use server";

import { Task } from '@/types';
import { taskRepository } from '@/repositories/task-repository';

export async function fetchTasksAction() {
  try {
    return await taskRepository.getTasks();
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return []; // Return mock tasks or empty array if Google Sheets is not configured
  }
}

export async function createTaskAction(task: Task) {
  try {
    return await taskRepository.createTask(task);
  } catch (error) {
    console.error("Failed to create task:", error);
    throw new Error('Failed to create task');
  }
}

export async function updateTaskAction(task: Task) {
  try {
    return await taskRepository.updateTask(task);
  } catch (error) {
    console.error("Failed to update task:", error);
    throw new Error('Failed to update task');
  }
}
