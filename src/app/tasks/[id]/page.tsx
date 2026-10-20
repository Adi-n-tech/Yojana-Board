import { fetchTaskAction } from '@/app/actions/tasks';
import { TaskDetailView } from '@/components/kanban/TaskDetailView';
import { notFound } from 'next/navigation';

export default async function TaskPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const taskId = params.id;
  
  const task = await fetchTaskAction(taskId);
  
  if (!task) {
    notFound();
  }
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-8">
        <TaskDetailView initialTask={task} />
      </div>
    </div>
  );
}
