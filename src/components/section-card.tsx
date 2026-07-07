import { cn } from "@/lib/utils";

export function SectionCard({
  children,
  className = "",
  light = false
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border p-5 shadow-card sm:p-6",
        light
          ? "border-white/30 bg-stage-card text-slate-900"
          : "border-white/10 bg-white/[0.04] text-white backdrop-blur",
        className
      )}
    >
      {children}
    </section>
  );
}
