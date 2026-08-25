"use server";

import { Task } from '@/types';

// In a real application, you would store GitHub installation tokens or PATs securely in the DB
const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || ''; 

export async function createGitHubIssueAction(task: Task, repository: string) {
  if (!GITHUB_TOKEN) {
    console.warn("GitHub integration is not fully configured (missing token).");
    return { issueUrl: 'https://github.com/mock-org/mock-repo/issues/1', issueNumber: 1 };
  }

  const response = await fetch(`https://api.github.com/repos/${repository}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `[${task.id}] ${task.title}`,
      body: `${task.description}\n\n**Priority**: ${task.priority}\n**Link**: ${process.env.NEXTAUTH_URL}/tasks/${task.id}`,
      labels: task.labels,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create GitHub issue:", errorText);
    throw new Error('Failed to create GitHub issue');
  }

  const data = await response.json();
  return {
    issueUrl: data.html_url,
    issueNumber: data.number,
  };
}
