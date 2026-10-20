"use client";

import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { fetchTasksAction } from '@/app/actions/tasks';

import { useRouter } from 'next/navigation';

export function ListView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await fetchTasksAction();
      const projectTasks = data.filter(t => t.projectId === projectId);
      setTasks(projectTasks);
    } catch (error) {
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks().then(() => setIsMounted(true));
  }, [projectId]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border bg-card text-card-foreground">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Type</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr 
                key={task.id} 
                className="border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/tasks/${task.id}`)}
              >
                <td className="px-4 py-3 text-muted-foreground">{task.id}</td>
                <td className="px-4 py-3 font-medium">{task.title}</td>
                <td className="px-4 py-3">{task.status}</td>
                <td className="px-4 py-3">{task.priority}</td>
                <td className="px-4 py-3">{task.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No tasks found.
          </div>
        )}
      </div>
    </div>
  );
}
