"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Task, Cycle } from '@/types';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { createTaskAction } from '@/app/actions/tasks';
import { fetchCyclesAction } from '@/app/actions/cycles';
import { getFormattedDate } from '@/lib/utils';

export function CreateTaskDialog({ projectId, onTaskCreated }: { projectId: string, onTaskCreated?: () => void }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('Todo');
  const [type, setType] = useState<Task['type']>('Feature');
  const [priority, setPriority] = useState<Task['priority']>('P2');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [cycleId, setCycleId] = useState('');
  const [cycles, setCycles] = useState<Cycle[]>([]);

  React.useEffect(() => {
    fetchCyclesAction().then(data => setCycles(data.filter(c => c.projectId === projectId)));
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reporter = session?.user?.email || session?.user?.name || 'Anonymous';
      
      const newTask: Task = {
        id: `${projectId}-${Math.floor(Math.random() * 1000)}`,
        projectId,
        title,
        description,
        status,
        type,
        priority,
        startDate,
        dueDate,
        cycleId,
        reporterId: reporter,
        labels: [],
        createdAt: getFormattedDate(),
        updatedAt: getFormattedDate(),
      };
      
      await createTaskAction(newTask);
      setOpen(false);
      
      // Reset form
      setTitle('');
      setDescription('');
      setStatus('Todo');
      setType('Feature');
      setPriority('P2');
      setStartDate('');
      setDueDate('');
      setCycleId('');
      
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" /> Create Task</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to your project. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Task title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Task description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                value={status} 
                onChange={e => setStatus(e.target.value as any)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="Backlog">Backlog</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select 
                id="type" 
                value={type} 
                onChange={e => setType(e.target.value as any)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="Feature">Feature</option>
                <option value="Bug">Bug</option>
                <option value="Task">Task</option>
                <option value="Chore">Chore</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select 
                id="priority" 
                value={priority} 
                onChange={e => setPriority(e.target.value as any)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="P0">P0 (Critical)</option>
                <option value="P1">P1 (High)</option>
                <option value="P2">P2 (Medium)</option>
                <option value="P3">P3 (Low)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycle">Cycle</Label>
              <select 
                id="cycle" 
                value={cycleId} 
                onChange={e => setCycleId(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                <option value="">No Cycle</option>
                {cycles.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input 
                id="start-date" 
                type="date"
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input 
                id="due-date" 
                type="date"
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
