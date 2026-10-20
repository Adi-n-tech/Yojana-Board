"use client";

import React, { useState } from 'react';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ListView } from '@/components/kanban/ListView';
import { Button } from '@/components/ui/button';
import { CyclesView } from './CyclesView';
import { CreateTaskDialog } from './CreateTaskDialog';

export function ProjectView({ projectId }: { projectId: string }) {
  const [view, setView] = useState<'board' | 'list' | 'cycles'>('board');

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold tracking-tight">{projectId}</h1>
          <div className="flex rounded-md bg-muted p-1">
            <button
              onClick={() => setView('board')}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                view === 'board' ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                view === 'list' ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('cycles')}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                view === 'cycles' ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Cycles
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Share</Button>
          <CreateTaskDialog projectId={projectId} />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        {view === 'board' && <KanbanBoard projectId={projectId} />}
        {view === 'list' && <ListView projectId={projectId} />}
        {view === 'cycles' && <CyclesView projectId={projectId} />}
      </div>
    </div>
  );
}
