import { cn } from "@/lib/utils";

export function BrandMark({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-glow">
        <div className="absolute inset-0 bg-gradient-to-br from-stage-violet via-stage-magenta to-stage-cyan opacity-90" />
        <div className="relative h-6 w-3 rounded-full bg-stage-bg">
          <div className="absolute left-1/2 top-4 h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-stage-bg bg-transparent" />
        </div>
      </div>
      {!compact ? (
        <div>
          <div className="font-display text-3xl uppercase tracking-[0.12em] text-white">StagePost AI</div>
          <div className="text-xs uppercase tracking-[0.22em] text-stage-muted">Live Music Content Engine</div>
        </div>
      ) : null}
    </div>
  );
}
