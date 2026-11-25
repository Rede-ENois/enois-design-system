import type { ReactNode } from "react";

import { cn } from "../../lib/utils.js";

/** Um card da retrospectiva, com título opcional e conteúdo. */
export function WrappedSection({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "surface-card flex min-h-[22rem] w-full flex-col gap-4 rounded-3xl p-5 text-left",
        className,
      )}
    >
      {title ? (
        <header className="space-y-1">
          <h2 className="text-lg font-semibold text-text-strong">{title}</h2>

          {subtitle ? <p className="text-sm text-text-subtle">{subtitle}</p> : null}
        </header>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-3">{children}</div>
    </section>
  );
}

/** Um número grande com o rótulo abaixo: o bloco de métrica. */
export function WrappedStat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 px-3 py-3 text-center">
      <div className="text-2xl font-semibold tabular-nums text-text-strong">{value}</div>

      <div className="mt-1 text-xs text-text-subtle">{label}</div>
    </div>
  );
}
