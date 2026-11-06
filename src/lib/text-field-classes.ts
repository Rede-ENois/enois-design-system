import { type ClassValue } from "clsx";

import { cn } from "./utils.js";

/** Keep compact text sizes on desktop without triggering focus zoom on iOS. */
export function textFieldClasses(...inputs: ClassValue[]) {
  return cn(
    ...inputs.map((input) => {
      const tokens = cn(input).split(/\s+/);
      // Let tailwind-merge distinguish font sizes from text colors and alignment.
      const size = tokens.find(
        (token) => token.startsWith("text-") && cn("text-xs", token) === token,
      );
      if (!size) return tokens.join(" ");
      return cn(
        size === "text-xs"
          ? "text-base md:text-xs"
          : size === "text-sm"
            ? "text-base md:text-sm"
            : `${size} md:${size}`,
        tokens.filter((token) => token !== size).join(" "),
      );
    }),
  );
}
