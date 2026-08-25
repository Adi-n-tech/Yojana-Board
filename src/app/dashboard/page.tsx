export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Work</h1>
        <p className="text-muted-foreground mt-2">
          Here are your tasks for today and upcoming deadlines.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards Mock */}
        {['Due Today', 'Overdue', 'In Progress', 'Completed'].map((metric) => (
          <div key={metric} className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">{metric}</h3>
            <div className="mt-2 text-2xl font-bold">0</div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-4">Assigned to me</h2>
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          No tasks assigned yet.
        </div>
      </div>
    </div>
  );
}
