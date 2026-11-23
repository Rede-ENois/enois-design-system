import { useId, useState } from "react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ModeratorWorkspaceGroup } from "../../types/domain/moderation/moderator-workspace-group.js";
import type { ModeratorWorkspaceProps } from "../../types/domain/moderation/moderator-workspace-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";

function normalizar(texto: string) {
  return texto.trim().toLocaleLowerCase("pt-BR");
}

/**
 * Navegacao do painel de moderacao: grupos visiveis no desktop, seletor rotulado no celular e
 * busca local que recorta as areas sem trocar a area ativa. A selecao e controlada — o app
 * decide o que cada area carrega e quem pode entrar nela.
 */
export function ModeratorWorkspace({
  groups,
  activeTab,
  onTabChange,
  children,
}: ModeratorWorkspaceProps) {
  const messages = useMessages().moderatorWorkspace;
  const id = useId();
  const [search, setSearch] = useState("");
  const query = normalizar(search);

  const filtered: ModeratorWorkspaceGroup[] = groups
    .map((group) => ({
      ...group,
      tabs: query
        ? group.tabs.filter((tab) =>
            `${group.label} ${tab.label}`.toLocaleLowerCase("pt-BR").includes(query),
          )
        : group.tabs,
    }))
    .filter((group) => group.tabs.length > 0);
  const count = filtered.reduce((total, group) => total + group.tabs.length, 0);
  const activeVisible = filtered.some((group) => group.tabs.some((tab) => tab.id === activeTab));

  const navigate = (tab: string) => {
    if (!groups.some((group) => group.tabs.some((item) => item.id === tab))) return;
    onTabChange(tab);
    setSearch("");
  };

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <nav
        aria-label={messages.navigation}
        className="min-w-0 self-start space-y-4 rounded-2xl border border-border-soft bg-surface-card p-3"
      >
        <p className="text-sm font-semibold text-text-strong">{messages.navigation}</p>

        <div className="space-y-2">
          <Label htmlFor={`${id}-search`}>{messages.search}</Label>

          <Input
            id={`${id}-search`}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={messages.searchPlaceholder}
          />
        </div>

        <div className="space-y-2 lg:hidden">
          <Label htmlFor={`${id}-destination`}>{messages.destination}</Label>

          <select
            id={`${id}-destination`}
            className="min-h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={activeVisible ? activeTab : ""}
            onChange={(event) => navigate(event.target.value)}
          >
            <option value="" disabled>
              {messages.chooseDestination}
            </option>

            {filtered.map((group) => (
              <optgroup key={group.id} label={group.label}>
                {group.tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {query ? (
          <div className="space-y-2">
            <p role="status" className="text-sm text-text-subtle">
              {count ? messages.results(count) : messages.noDestinations}
            </p>

            <Button type="button" variant="ghost" size="sm" onClick={() => setSearch("")}>
              {messages.clear}
            </Button>
          </div>
        ) : null}

        <div className="hidden space-y-4 lg:block">
          {filtered.map((group) => (
            <div key={group.id} className="space-y-1">
              <h2 className="break-words px-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">
                {group.label}
              </h2>

              <ul className="space-y-1">
                {group.tabs.map((tab) => (
                  <li key={tab.id} className="min-w-0">
                    <button
                      type="button"
                      aria-current={activeTab === tab.id ? "page" : undefined}
                      onClick={() => navigate(tab.id)}
                      className={cn(
                        "min-h-10 w-full rounded-lg px-3 py-2 text-left text-sm whitespace-normal break-words transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-text-strong hover:bg-surface-2",
                      )}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
