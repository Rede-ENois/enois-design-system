import type { ReactNode } from "react";

import { Label } from "../../ui/label.js";

export function FilterSelect({
  id,
  label,
  allLabel,
  value,
  onChange,
  options,
  labels,
}: {
  id: string;
  label: string;
  allLabel: string;
  value: string;
  onChange: (value: string) => void;
  /** Valores presentes no lote atual, sem repetição. */
  options: string[];
  labels: Record<string, string | undefined>;
}) {
  const items: ReactNode[] = [
    <option key="" value="">
      {allLabel}
    </option>,
    ...options.map((option) => (
      <option key={option} value={option}>
        {labels[option] ?? option}
      </option>
    )),
  ];

  return (
    <>
      <Label htmlFor={id}>{label}</Label>

      <select
        id={id}
        className="min-h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {items}
      </select>
    </>
  );
}
