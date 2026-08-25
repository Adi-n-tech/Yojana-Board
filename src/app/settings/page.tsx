export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your workspace preferences.
        </p>
      </div>
      <div className="space-y-6 mt-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-lg">Workspace Details</h3>
          <p className="text-sm text-muted-foreground mb-4">Update your organization info.</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace Name</label>
              <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="Yojana Board" disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
