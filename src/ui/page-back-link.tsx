import type { PageBackLinkProps } from "../types/components/ui/page-back-link-props.js";

/**
 * Volta para a página de onde se veio (perfil, lista de blogs), acima do conteúdo.
 *
 * É âncora de verdade (`href`), não botão de histórico: quem chegou pelo link compartilhado não tem
 * para onde voltar no histórico, e o destino do "voltar" precisa ser sempre o mesmo.
 */
export function PageBackLink({ href, icon: Icon, children }: PageBackLinkProps) {
  return (
    <nav className="mb-4">
      <a
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}

        <>{children}</>
      </a>
    </nav>
  );
}
