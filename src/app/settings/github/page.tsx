import { Button } from '@/components/ui/button';

export default function GitHubSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">GitHub Integration</h1>
        <p className="text-muted-foreground mt-2">
          Connect repositories to your projects to automatically sync issues.
        </p>
      </div>
      
      <div className="mt-4 rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-2">Connect GitHub Account</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Authenticate to enable two-way sync for pull requests and issue tracking.
        </p>
        <Button>Connect to GitHub</Button>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">Repository Mapping</h3>
        <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
          No repositories connected yet. Authenticate above to configure mapping.
        </div>
      </div>
    </div>
  );
}
