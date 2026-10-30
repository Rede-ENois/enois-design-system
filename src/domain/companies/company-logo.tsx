import { useAdapters } from "../../adapters/adapters-context.js";
import { cn } from "../../lib/utils.js";

/** Two letters from the name: the mark of a company without a logo. */
function monogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? `${words[0][0]}${words[1][0]}` : (words[0] ?? "").slice(0, 2);
  return letters.toUpperCase();
}

/**
 * The company mark: a rounded square (people are circles, companies are not), the logo or a quiet
 * monogram. Decorative next to the name, so it never repeats it to screen readers.
 */
export function CompanyLogo({
  name,
  logo,
  className,
}: {
  name: string;
  logo: string | null;
  className?: string;
}) {
  const src = useAdapters().resolveMediaUrl(logo);

  return (
    <span
      aria-hidden
      className={cn(
        "grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-border-soft bg-primary-soft text-sm font-semibold text-primary",
        className,
      )}
    >
      {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : monogram(name)}
    </span>
  );
}
