import { Globe } from "lucide-react";

import { FOCUS_RING } from "../../lib/focus-ring.js";
import { safeHref } from "../../lib/safe-href.js";
import { cn } from "../../lib/utils.js";
import type { CompanyWebsiteLinkProps } from "../../types/domain/jobs/company-website-link-props.js";

/** The company's site as a link, only when the stored value is a safe href; otherwise nothing. */
export function CompanyWebsiteLink({ website }: CompanyWebsiteLinkProps) {
  const href = safeHref(website);
  if (!href || !website) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-1 text-primary hover:underline", FOCUS_RING)}
    >
      <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {website.replace(/^https?:\/\//, "")}
    </a>
  );
}
