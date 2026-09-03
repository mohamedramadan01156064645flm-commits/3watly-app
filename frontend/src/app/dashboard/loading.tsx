export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
      {/* Top Banner Skeleton */}
      <div className="h-32 rounded-3xl bg-slate-100 dark:bg-slate-800/60" />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-700" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-8 w-36 rounded-lg bg-slate-200 dark:bg-slate-700" />
          <div className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
    </div>
  );
}
