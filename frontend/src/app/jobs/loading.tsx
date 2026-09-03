export default function JobsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-6">
      {/* Search & Filter Header Skeleton */}
      <div className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-24 rounded-xl bg-slate-100 dark:bg-slate-800/60" />
        ))}
      </div>

      {/* Job Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
        ))}
      </div>
    </div>
  );
}
