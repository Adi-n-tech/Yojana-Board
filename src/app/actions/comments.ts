"use server";

import { Comment } from '@/types';
import { commentRepository } from '@/repositories/comment-repository';

export async function fetchCommentsAction(taskId: string) {
  try {
    return await commentRepository.getCommentsForTask(taskId);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return [];
  }
}

export async function createCommentAction(comment: Comment) {
  try {
    return await commentRepository.createComment(comment);
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw new Error('Failed to create comment');
  }
}
