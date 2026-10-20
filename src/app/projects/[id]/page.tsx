import { ProjectView } from '@/components/kanban/ProjectView';

export default async function ProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const projectId = params.id;
  
  return <ProjectView projectId={projectId} />;
}
