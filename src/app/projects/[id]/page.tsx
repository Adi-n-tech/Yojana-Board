import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const projectId = params.id;
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold">{projectId}</h1>
          <p className="text-sm text-muted-foreground">Kanban Board</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">List View</Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto p-8">
        <KanbanBoard projectId={projectId} />
      </div>
    </div>
  );
}
