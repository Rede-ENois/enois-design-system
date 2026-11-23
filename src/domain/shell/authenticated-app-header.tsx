import { Menu } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { AppHeaderLayout } from "../../patterns/app-shell/app-header-layout.js";
import type { AuthenticatedAppHeaderProps } from "../../types/domain/shell/authenticated-app-header-props.js";
import { Signal } from "../../ui/signal.js";

import { AppBrand } from "./app-brand.js";

export function AuthenticatedAppHeader({
  homeHref,
  onOpenNavigation,
  navigationHasNews = false,
  search,
  actions,
}: AuthenticatedAppHeaderProps) {
  const messages = useMessages().authenticatedAppHeader;

  return (
    <AppHeaderLayout>
      {/* Mobile: hamburger a esquerda, logo centralizado, acoes a direita */}
      <button
        onClick={onOpenNavigation}
        className={menuButtonClassName()}
        aria-label={messages.openMenu}
        title={messages.openMenu}
      >
        <Menu className="h-5 w-5" />
        {navigationHasNews && (
          <Signal signal={{ kind: "new" }} onIcon className="absolute right-1 top-1" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 items-center max-md:justify-center md:flex-none md:shrink-0">
        <AppBrand href={homeHref} />
      </div>
      {search}

      <div className="relative z-20 flex items-center gap-2 md:ml-auto">{actions}</div>
    </AppHeaderLayout>
  );
}
// A acao vem PRIMEIRO, antes do embrulho da marca, e o `order` a poe de novo na esquerda: no
// celular isso e o primeiro item da casca de verdade. Antes, quem montasse no app uma casca com
// colunas (grade) ou linhas (flex com embrulho) jogava o menu para o canto dele e o resto ficava
// numa coluna estreita do lado. Do md para cima o `order` some e o embrulho vira item flex de novo.
function menuButtonClassName(): string {
  return "relative z-20 grid h-11 w-11 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-primary max-md:order-first max-md:col-start-1 max-md:row-start-1 lg:hidden";
}
