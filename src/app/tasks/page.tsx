export default function InboxPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground mt-2">
          Your personal task notifications and updates.
        </p>
      </div>
      <div className="rounded-md border p-8 text-center text-muted-foreground bg-card">
        You're all caught up!
      </div>
    </div>
  );
}
