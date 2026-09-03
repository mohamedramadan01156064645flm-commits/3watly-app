export default function CopilotLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-pulse space-y-6">
      <div className="h-16 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
      <div className="h-[calc(100vh-280px)] rounded-3xl bg-slate-100 dark:bg-slate-800/60 p-6 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="h-12 w-64 rounded-2xl bg-slate-200 dark:bg-slate-700/60" />
          <div className="h-20 w-3/4 rounded-2xl bg-slate-200 dark:bg-slate-700/60" />
        </div>
        <div className="h-12 w-full rounded-2xl bg-slate-200 dark:bg-slate-700/60" />
      </div>
    </div>
  );
}
