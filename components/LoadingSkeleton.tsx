function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-4 backdrop-blur-xl h-full"
      style={{
        background:
          'linear-gradient(135deg, rgba(148,163,184,0.10) 0%, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0.4) 100%)',
        boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.2)',
      }}
    >
      <div className="animate-pulse flex flex-col gap-3 h-full">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-slate-200/70" />
          <div className="h-2 w-20 bg-slate-200/70 rounded-full" />
        </div>
        <div className="h-9 w-28 bg-slate-200/70 rounded-lg" />
        <div className="h-2.5 w-24 bg-slate-200/50 rounded-full" />
        <div className="flex-1 min-h-[44px] bg-slate-100/70 rounded-lg" />
      </div>
    </div>
  )
}

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-fr">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}
