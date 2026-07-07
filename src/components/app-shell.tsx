import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function AppShell({
  children,
  eyebrow,
  title,
  description,
  aside
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stage-bg text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-stage-panel/80 p-5 shadow-glow backdrop-blur sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <BrandMark />
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-stage-cyan">
                {eyebrow}
              </span>
            </div>
            <div className="max-w-3xl space-y-3">
              <h1 className="font-display text-5xl uppercase leading-none tracking-[0.06em] text-white sm:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-base text-stage-muted sm:text-lg">{description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-stage-cyan/40 hover:bg-white/10"
            >
              New generation
            </Link>
            <Link
              href="/history"
              className="rounded-full border border-stage-violet/30 bg-stage-violet/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-stage-magenta/50 hover:bg-stage-violet/20"
            >
              History
            </Link>
          </div>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <main className="space-y-6">{children}</main>
          <aside className="space-y-6">{aside}</aside>
        </div>
      </div>
    </div>
  );
}
