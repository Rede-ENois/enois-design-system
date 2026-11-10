import type { ComponentProps } from "react";

/**
 * O selo "Humanidade Comprovada", desenhado aqui.
 *
 * O lucide não tem um selo de humanidade: o `BadgeCheck` genérico é confundido com verificação
 * profissional. Por isso o ícone é próprio — um selo com a marca de aprovação dentro, e um traço
 * de pessoa na base, que não existe em nenhum outro ícone do app.
 */
export function HumanitySealIcon({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...props}
    >
      <path d="M12 2.6l2.3 1.7 2.8-.3 1 2.7 2.4 1.6-.9 2.7.9 2.7-2.4 1.6-1 2.7-2.8-.3L12 21.4l-2.3-1.7-2.8.3-1-2.7L3.5 15.7l.9-2.7-.9-2.7L5.9 8.7l1-2.7 2.8.3z" />
      <path d="M9.2 12.1l2 2 3.7-4" />
    </svg>
  );
}
