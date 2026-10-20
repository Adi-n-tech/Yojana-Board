"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/types';
import { fetchTasksAction, updateTaskAction } from '@/app/actions/tasks';
import { createActivityAction } from '@/app/actions/activities';
import { getFormattedDate } from '@/lib/utils';

const STATUSES: TaskStatus[] = ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'];

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function KanbanBoard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { data: session } = useSession();
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

  if (!isMounted) return null; // Avoid hydration mismatch for dnd

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    
    // Find the task being moved
    const movedTask = tasks.find(t => t.id === draggableId);
    if (!movedTask) return;

    // Update local state optimistically
    setTasks(prev => prev.map(task => 
      task.id === draggableId ? { ...task, status: newStatus } : task
    ));
    
    // Call API to update task status in Google Sheets
    try {
      await updateTaskAction({
        ...movedTask,
        status: newStatus,
        updatedAt: getFormattedDate(),
      });
      
      if (movedTask.status !== newStatus) {
        const currentUser = session?.user?.email || session?.user?.name || 'Anonymous';
        await createActivityAction({
          id: `ACT-${Math.floor(Math.random() * 10000)}`,
          taskId: movedTask.id,
          userId: currentUser,
          action: `changed status from ${movedTask.status} to ${newStatus}`,
          timestamp: getFormattedDate(),
        });
      }
    } catch (error) {
      console.error("Failed to update status on drag", error);
      // Revert local state on failure
      setTasks(prev => prev.map(task => 
        task.id === draggableId ? { ...task, status: source.droppableId as TaskStatus } : task
      ));
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-6">
          {STATUSES.map(status => {
            const columnTasks = tasks.filter(t => t.status === status);
            
            return (
              <div key={status} className="flex h-full w-80 flex-shrink-0 flex-col rounded-lg bg-muted/50 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{status}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {columnTasks.length}
                  </span>
                </div>
                
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 space-y-3 min-h-[150px]"
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => router.push(`/tasks/${task.id}`)}
                              className="rounded-md border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer active:cursor-grabbing"
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">{task.id}</span>
                              </div>
                              <h4 className="text-sm font-medium leading-snug mb-3">{task.title}</h4>
                              <div className="flex items-center gap-2">
                                {task.labels.map(label => (
                                  <span key={label} className="rounded border px-1.5 py-0.5 text-[10px] font-semibold">
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
}
