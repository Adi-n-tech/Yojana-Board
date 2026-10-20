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
import { Cycle } from '@/types';
import { Plus } from 'lucide-react';
import { createCycleAction } from '@/app/actions/cycles';

export function CreateCycleDialog({ projectId, onCycleCreated }: { projectId: string, onCycleCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCycle: Cycle = {
        id: `CYC-${Math.floor(Math.random() * 1000)}`,
        projectId,
        name,
        startDate,
        endDate,
      };
      
      await createCycleAction(newCycle);
      setOpen(false);
      
      setName('');
      setStartDate('');
      setEndDate('');
      
      if (onCycleCreated) {
        onCycleCreated();
      }
    } catch (error) {
      console.error(error);
      alert('Failed to create cycle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Cycle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Cycle</DialogTitle>
          <DialogDescription>
            Add a new cycle (sprint) to your project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Cycle Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Cycle 1, Sprint Alpha" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input 
                id="start-date" 
                type="date"
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input 
                id="end-date" 
                type="date"
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creating...' : 'Create Cycle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
