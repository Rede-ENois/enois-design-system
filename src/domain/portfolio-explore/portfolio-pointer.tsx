import type { PortfolioPointerProps } from "../../types/domain/portfolio-explore/portfolio-pointer-props.js";
import { Skeleton } from "../../ui/skeleton.js";
import { UserAvatar } from "../avatar/user-avatar.js";

/**
 * A vitrine como um post-porta: a pessoa, o título que ela publicou e a primeira frase da página.
 * O quadro inteiro leva à vitrine; a leitura é a mesma de qualquer visita. Enquanto a vitrine chega,
 * o quadro fica em espera no mesmo lugar para o card do feed não pular.
 */
export function PortfolioPointer({
  name,
  avatarUrl,
  title,
  headline,
  href,
  loading = false,
  onNavigate,
}: PortfolioPointerProps) {
  if (loading) return <Skeleton className="h-20 w-full rounded-xl" />;

  return (
    <a
      href={href}
      onClick={onNavigate}
      className="focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2"
    >
      <span className="flex items-start gap-3 rounded-xl border border-border-soft bg-surface-1 p-3">
        <UserAvatar src={avatarUrl} alt={name} className="h-10 w-10" />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-text-strong">
            {title ?? name}
          </span>

          {headline && (
            <span className="mt-0.5 line-clamp-2 block text-sm font-normal text-muted-foreground">
              {headline}
            </span>
          )}
        </span>
      </span>
    </a>
  );
}
