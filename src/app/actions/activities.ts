"use server";

import { Activity } from '@/types';
import { activityRepository } from '@/repositories/activity-repository';

export async function fetchActivitiesAction(taskId: string) {
  try {
    return await activityRepository.getActivitiesForTask(taskId);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return [];
  }
}

export async function createActivityAction(activity: Activity) {
  try {
    return await activityRepository.createActivity(activity);
  } catch (error) {
    console.error("Failed to create activity:", error);
    throw new Error('Failed to create activity');
  }
}
