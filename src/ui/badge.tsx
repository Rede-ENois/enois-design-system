import { cn } from "../lib/utils.js";
import type { BadgeProps } from "../types/components/ui/badge-props.js";

import { badgeVariants } from "./badge-variants.js";

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
