export function EmptyState() {
  return (
    <div className="text-sm space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-medium text-foreground">Welcome to woop</h2>
        <p className="text-muted-foreground">Your cross-device clipboard, instantly synced.</p>
      </div>

      <div className="space-y-2 text-muted-foreground">
        <p>Type something below and hit Enter to create your first woop.</p>
        <p>Then open woop on any other device on your network — it'll be there.</p>
      </div>
    </div>
  );
}
