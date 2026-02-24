export default function ProjectLoading() {
  return (
    <div className="flex h-[calc(100vh-97px)] items-center justify-center bg-bg-secondary">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-primary border-t-accent" />
        <p className="text-sm text-text-tertiary">Loading project. . .</p>
      </div>
    </div>
  );
}
