"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Task, TaskStatus } from '@/types';

const STATUSES: TaskStatus[] = ['Backlog', 'Todo', 'In Progress', 'In Review', 'Done'];

// Mock tasks for initial render
const MOCK_TASKS: Task[] = [
  {
    id: 'AND-123',
    projectId: 'PROJ-1',
    title: 'Fix Firebase authentication crash',
    description: 'App crashes on login screen for new users.',
    type: 'Bug',
    status: 'Todo',
    priority: 'P1',
    reporterId: 'user-1',
    labels: ['Firebase', 'Bug'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'AND-124',
    projectId: 'PROJ-1',
    title: 'Implement Dark Mode',
    description: 'Add support for system dark mode.',
    type: 'Feature',
    status: 'In Progress',
    priority: 'P2',
    reporterId: 'user-1',
    labels: ['UI'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export function KanbanBoard({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // In a real implementation, this would fetch from the Google Sheets API via Server Actions or TanStack Query
    setTasks(MOCK_TASKS);
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Avoid hydration mismatch for dnd

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    
    // Update local state optimistically
    setTasks(prev => prev.map(task => 
      task.id === draggableId ? { ...task, status: newStatus } : task
    ));
    
    // TODO: Call API to update task status in Google Sheets
  };

  return (
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
                            className="rounded-md border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
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
  );
}
