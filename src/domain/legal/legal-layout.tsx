import { useMessages } from "../../messages/messages-context.js";
import type { LegalLastUpdatedProps } from "../../types/domain/legal/legal-last-updated-props.js";
import type { LegalLayoutProps } from "../../types/domain/legal/legal-layout-props.js";
import type { LegalSectionProps } from "../../types/domain/legal/legal-section-props.js";
import { AppLink } from "../../ui/app-link.js";

export function LegalLayout({ year, hrefs, themeToggle, children }: LegalLayoutProps) {
  const brand = useMessages().appBrand;
  const messages = useMessages().legalLayout;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-4 px-4 sm:px-6">
          <AppLink href={hrefs.home} className="flex items-center gap-2">
            <img src="/brand/mark-primary.svg" alt="" className="h-9 w-9 shrink-0" />

            <span className="text-base font-semibold tracking-tight">
              <>{brand.prefix}</>

              <span className="gradient-text">{brand.accent}</span>
            </span>
          </AppLink>

          {themeToggle}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="surface-card space-y-8 p-6 sm:p-10">{children}</div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-muted-foreground sm:px-6">
          <p>{messages.copyright(year)}</p>

          <nav className="flex items-center gap-4">
            <AppLink href={hrefs.about} className="transition-colors hover:text-foreground">
              {messages.about}
            </AppLink>

            <AppLink href={hrefs.terms} className="transition-colors hover:text-foreground">
              {messages.terms}
            </AppLink>

            <AppLink href={hrefs.privacy} className="transition-colors hover:text-foreground">
              {messages.privacy}
            </AppLink>

            <AppLink href={hrefs.guidelines} className="transition-colors hover:text-foreground">
              {messages.guidelines}
            </AppLink>
          </nav>
        </div>

        {/* Mesmo aviso do rodapé da landing: identidade do projeto, não promessa de marca. */}
        <p className="mx-auto mt-4 max-w-4xl px-4 text-xs leading-relaxed text-muted-foreground sm:px-6">
          {messages.disclaimer}
        </p>
      </footer>
    </div>
  );
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground [&_p]:whitespace-pre-line [&_p]:break-words">
        {children}
      </div>
    </section>
  );
}

export function LegalLastUpdated({ date }: LegalLastUpdatedProps) {
  const messages = useMessages().legalLastUpdated;

  return (
    <p className="text-xs text-muted-foreground">
      <>{messages.label}</>

      <time dateTime={date}>{date}</time>
    </p>
  );
}
