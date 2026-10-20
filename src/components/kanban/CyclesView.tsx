"use client";

import React, { useState, useEffect } from 'react';
import { Cycle, Task } from '@/types';
import { fetchCyclesAction } from '@/app/actions/cycles';
import { fetchTasksAction } from '@/app/actions/tasks';
import { CreateCycleDialog } from './CreateCycleDialog';

export function CyclesView({ projectId }: { projectId: string }) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const fetchData = async () => {
    try {
      const [cyclesData, tasksData] = await Promise.all([
        fetchCyclesAction(),
        fetchTasksAction()
      ]);
      setCycles(cyclesData.filter(c => c.projectId === projectId));
      setTasks(tasksData.filter(t => t.projectId === projectId));
    } catch (error) {
      setCycles([]);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchData().then(() => setIsMounted(true));
  }, [projectId]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold tracking-tight">Project Cycles</h2>
        <CreateCycleDialog projectId={projectId} onCycleCreated={fetchData} />
      </div>

      <div className="grid gap-4">
        {cycles.length === 0 ? (
          <div className="rounded-md border p-8 text-center text-muted-foreground">
            No cycles found. Create one to organize your tasks into sprints!
          </div>
        ) : (
          cycles.map(cycle => {
            const cycleTasks = tasks.filter(t => t.cycleId === cycle.id);
            const completed = cycleTasks.filter(t => t.status === 'Done').length;
            const progress = cycleTasks.length === 0 ? 0 : Math.round((completed / cycleTasks.length) * 100);

            return (
              <div key={cycle.id} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{cycle.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {cycle.startDate} - {cycle.endDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">{cycleTasks.length} Tasks</span>
                    <span className="text-xs text-muted-foreground mt-1">{completed} completed</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
