import type { PageHeaderProps } from "../types/components/ui/page-header-props.js";

/**
 * Cabeçalho de página: título, descrição e ações num cartão só.
 *
 * Cada tela montava o seu — com cartão ou sem, título em `text-xl` ou `text-2xl`, e o botão de
 * criar herdando o `w-full` do tamanho padrão do Button, o que virava uma barra roxa da largura
 * da página. Aqui as ações ficam do tamanho do conteúdo (`[&>*]:w-auto`), à direita no desktop.
 *
 * A margem inferior mora aqui porque o cabeçalho é filho direto do que a tela empilha: sem ela, a
 * tela que não tem `space-y`/`gap` no pai encosta o elemento seguinte (busca, filtro, grade) no
 * cartão do título. Com `space-y`/`gap`, a soma do gap com esta margem é o respiro.
 */
export function PageHeader({ title, description, icon: Icon, actions, children }: PageHeaderProps) {
  return (
    <header className="surface-card mb-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-text-strong">
            {Icon && <Icon className="h-5 w-5 shrink-0 text-primary" />}

            <span className="min-w-0 break-words">{title}</span>
          </h1>

          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>

        {actions && <div className="flex flex-wrap items-center gap-2 [&>*]:w-auto">{actions}</div>}
      </div>

      {children}
    </header>
  );
}
