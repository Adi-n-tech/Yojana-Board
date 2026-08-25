export default function TeamsPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground mt-2">
          Manage workspace teams and members.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Mock Teams */}
        {['Engineering', 'Design', 'Product'].map((team) => (
          <div key={team} className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold">{team}</h3>
            <p className="text-sm text-muted-foreground mt-1">3 members</p>
          </div>
        ))}
      </div>
    </div>
  );
}
