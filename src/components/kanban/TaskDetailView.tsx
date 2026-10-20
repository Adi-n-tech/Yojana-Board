"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Task, Comment, Activity, Cycle } from '@/types';
import { updateTaskAction } from '@/app/actions/tasks';
import { fetchCommentsAction, createCommentAction } from '@/app/actions/comments';
import { fetchActivitiesAction, createActivityAction } from '@/app/actions/activities';
import { fetchCyclesAction } from '@/app/actions/cycles';
import { getFormattedDate } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface TaskDetailViewProps {
  initialTask: Task;
}

export function TaskDetailView({ initialTask }: TaskDetailViewProps) {
  const { data: session } = useSession();
  const currentUser = session?.user?.email || session?.user?.name || 'Anonymous';

  const [task, setTask] = useState<Task>(initialTask);
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState(initialTask.title);
  const [description, setDescription] = useState(initialTask.description);
  const [status, setStatus] = useState<Task['status']>(initialTask.status);
  const [type, setType] = useState<Task['type']>(initialTask.type);
  const [priority, setPriority] = useState<Task['priority']>(initialTask.priority);
  const [startDate, setStartDate] = useState(initialTask.startDate || '');
  const [dueDate, setDueDate] = useState(initialTask.dueDate || '');
  const [cycleId, setCycleId] = useState(initialTask.cycleId || '');

  const [taskComments, setTaskComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchCommentsAction(task.id).then(setTaskComments);
    fetchActivitiesAction(task.id).then(setActivities);
    fetchCyclesAction().then(data => setCycles(data.filter(c => c.projectId === task.projectId)));
  }, [task.id, task.projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedTask: Task = {
        ...task,
        title,
        description,
        status,
        type,
        priority,
        startDate,
        dueDate,
        cycleId,
        updatedAt: getFormattedDate(),
      };
      
      await updateTaskAction(updatedTask);
      
      if (task.status !== status) {
        await createActivityAction({
          id: `ACT-${Math.floor(Math.random() * 10000)}`,
          taskId: task.id,
          userId: currentUser,
          action: `changed status from ${task.status} to ${status}`,
          timestamp: getFormattedDate(),
        });
      }
      
      setTask(updatedTask);
      alert('Task updated successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const comment: Comment = {
        id: `COM-${Math.floor(Math.random() * 10000)}`,
        taskId: task.id,
        authorId: currentUser,
        content: newComment.trim(),
        createdAt: getFormattedDate(),
      };
      await createCommentAction(comment);
      setTaskComments([...taskComments, comment]);
      setNewComment('');
    } catch (error) {
      console.error(error);
      alert('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const timelineItems = [...taskComments, ...activities].sort(
    (a, b) => new Date(b.createdAt || (a as Activity).timestamp).getTime() - new Date(a.createdAt || (b as Activity).timestamp).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href={`/projects/${task.projectId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task {task.id}</h1>
          <p className="text-muted-foreground mt-2">Manage task details, comments, and activity.</p>
        </div>
        <Button type="submit" form="edit-task-form" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="col-span-1 lg:col-span-2">
          <form id="edit-task-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Task title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <textarea 
                id="edit-description" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Task description" 
                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <select 
                  id="edit-status" 
                  value={status} 
                  onChange={e => setStatus(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Backlog">Backlog</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <select 
                  id="edit-type" 
                  value={type} 
                  onChange={e => setType(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Feature">Feature</option>
                  <option value="Bug">Bug</option>
                  <option value="Task">Task</option>
                  <option value="Chore">Chore</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-cycle">Cycle</Label>
                <select 
                  id="edit-cycle" 
                  value={cycleId} 
                  onChange={e => setCycleId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">No Cycle</option>
                  {cycles.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <select 
                  id="edit-priority" 
                  value={priority} 
                  onChange={e => setPriority(e.target.value as any)}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="P0">P0 (Critical)</option>
                  <option value="P1">P1 (High)</option>
                  <option value="P2">P2 (Medium)</option>
                  <option value="P3">P3 (Low)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input 
                  id="edit-start-date" 
                  type="date"
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input 
                  id="edit-due-date" 
                  type="date"
                  value={dueDate} 
                  onChange={e => setDueDate(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t text-sm text-muted-foreground grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-foreground">Created:</span> {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}
              </div>
              <div>
                <span className="font-semibold text-foreground">Last Updated:</span> {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}
              </div>
            </div>
          </form>
        </div>
        
        <div className="col-span-1 border-l pl-8 flex flex-col h-[calc(100vh-200px)]">
          <h3 className="font-semibold text-lg mb-4">Activity & Comments</h3>
          
          <div className="flex-1 overflow-y-auto space-y-5 pr-2 mb-4">
            {timelineItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No activity yet</p>
            ) : (
              timelineItems.map((item) => {
                const isComment = 'content' in item;
                return (
                  <div key={item.id} className="text-sm">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                      <span className="font-semibold text-foreground">{isComment ? item.authorId : (item as Activity).userId}</span>
                      <span>{new Date(isComment ? item.createdAt : (item as Activity).timestamp).toLocaleString()}</span>
                    </div>
                    {isComment ? (
                      <div className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed border">{item.content}</div>
                    ) : (
                      <div className="italic text-muted-foreground">{(item as Activity).action}</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
          
          <div className="pt-4 border-t mt-auto">
            <div className="flex flex-col gap-3">
              <Input 
                placeholder="Add a comment..." 
                value={newComment} 
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              />
              <Button onClick={handleAddComment} disabled={commentLoading || !newComment.trim()} className="w-full">
                {commentLoading ? 'Posting...' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
