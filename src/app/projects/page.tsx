import Link from 'next/link';
import { CreateProjectDialog } from '@/components/kanban/CreateProjectDialog';
import { fetchProjectsAction } from '@/app/actions/projects';
import { fetchTasksAction } from '@/app/actions/tasks';

export default async function ProjectsPage() {
  const [projects, tasks] = await Promise.all([
    fetchProjectsAction(),
    fetchTasksAction()
  ]);

  const projectsWithCounts = projects.map(project => ({
    ...project,
    taskCount: tasks.filter(t => t.projectId === project.id).length,
    status: 'Active' // We can expand this later if we add project statuses
  }));

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your workspace projects and workstreams.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {projectsWithCounts.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          No projects found. Create one to get started!
        </div>
      ) : (
        <div className="grid gap-4">
          {projectsWithCounts.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
            >
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {project.id}</p>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description}</p>
                )}
              </div>
              <div className="flex items-center gap-6">
                <div className="text-sm text-muted-foreground">{project.taskCount} tasks</div>
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                  {project.status}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
