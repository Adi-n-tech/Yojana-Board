import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ProjectsPage() {
  const projects = [
    { id: 'PROJ-1', name: 'Android App', status: 'Active', tasks: 12 },
    { id: 'PROJ-2', name: 'Backend API', status: 'Active', tasks: 24 },
  ];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your workspace projects and workstreams.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
          >
            <div>
              <h3 className="font-medium">{project.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {project.id}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-sm text-muted-foreground">{project.tasks} tasks</div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {project.status}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
