import { fetchTasksAction } from '@/app/actions/tasks';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession();
  const currentUser = session?.user?.email || session?.user?.name || 'Anonymous';
  
  const tasks = await fetchTasksAction();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let dueToday = 0;
  let overdue = 0;
  let inProgress = 0;
  let completed = 0;

  const myTasks = tasks.filter(t => t.reporterId === currentUser || t.assigneeId === currentUser);

  tasks.forEach(task => {
    if (task.status === 'Done') {
      completed++;
    } else if (task.status === 'In Progress') {
      inProgress++;
    }

    if (task.dueDate && task.status !== 'Done') {
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate.getTime() === today.getTime()) {
        dueToday++;
      } else if (dueDate.getTime() < today.getTime()) {
        overdue++;
      }
    }
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Work</h1>
        <p className="text-muted-foreground mt-2">
          Here are your tasks for today and upcoming deadlines.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Due Today</h3>
          <div className="mt-2 text-2xl font-bold">{dueToday}</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground text-red-500">Overdue</h3>
          <div className="mt-2 text-2xl font-bold text-red-500">{overdue}</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
          <div className="mt-2 text-2xl font-bold">{inProgress}</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
          <div className="mt-2 text-2xl font-bold">{completed}</div>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Assigned to me</h2>
        {myTasks.length === 0 ? (
          <div className="rounded-md border p-8 text-center text-muted-foreground">
            No tasks assigned to you yet.
          </div>
        ) : (
          <div className="rounded-md border bg-card text-card-foreground">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {myTasks.map(task => (
                  <tr key={task.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">
                      <Link href={`/tasks/${task.id}`} className="hover:underline text-primary">{task.id}</Link>
                    </td>
                    <td className="px-4 py-3 font-medium">{task.title}</td>
                    <td className="px-4 py-3">{task.projectId}</td>
                    <td className="px-4 py-3">{task.status}</td>
                    <td className="px-4 py-3">{task.dueDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
