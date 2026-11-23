import type { WithRequiredChildren } from "../../types/components/with-required-children.js";
import type { AppLayoutMainProps } from "../../types/patterns/app-layout-main-props.js";

function AppLayoutRoot({ children }: WithRequiredChildren) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Warm lamp light over the top of the page; decorative, never in the way of a click. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[image:var(--lamp)] bg-no-repeat"
      />

      <div className="relative">{children}</div>
    </div>
  );
}

function AppLayoutHeader({ children }: WithRequiredChildren) {
  return <>{children}</>;
}

function AppLayoutContent({ children }: WithRequiredChildren) {
  return (
    // Bottom room on phones so the last item is never under the flat dock.
    <div className="mx-auto flex max-w-7xl gap-6 px-3 pb-20 pt-4 sm:px-6 sm:pt-6 lg:pb-6">
      {children}
    </div>
  );
}

function AppLayoutSidebar({ children }: WithRequiredChildren) {
  return <>{children}</>;
}

function AppLayoutMain({ children, gap = "none" }: AppLayoutMainProps) {
  // A coluna do conteudo e sempre do tamanho da casca: `w-full` a mantem no calculo do pai e
  // `max-w-full` impede que ela cresca por causa do que tem dentro (conteudo largo rola ou se
  // acomoda dentro do main, nunca empurra a pagina). O `gap` e flex e nao `space-y`: `space-y`
  // zera a margem de cima de todo filho depois do primeiro, e um bloco posicionado de proposito
  // em cima da borda (como o "novidades" do feed) perde a posicao e volta para o fluxo.
  const base = "min-w-0 w-full max-w-full flex-1";
  const classes = gap === "md" ? `${base} flex flex-col gap-4` : base;
  return <main className={classes}>{children}</main>;
}

function AppLayoutNavigation({ children }: WithRequiredChildren) {
  return <>{children}</>;
}

export const AppLayout = Object.assign(AppLayoutRoot, {
  Header: AppLayoutHeader,
  Content: AppLayoutContent,
  Sidebar: AppLayoutSidebar,
  Main: AppLayoutMain,
  Navigation: AppLayoutNavigation,
});
