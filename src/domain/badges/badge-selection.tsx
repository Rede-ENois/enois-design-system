import { useRef, useState } from "react";

import { History, Plus, X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { BadgeSelectionProps } from "../../types/domain/badges/badge-selection-props.js";
import { Button } from "../../ui/button.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.js";

import { BADGE_ACCEPT } from "./badge-accept.js";
import { MAX_BADGES } from "./max-badges.js";
import { UserBadge } from "./user-badge.js";

/**
 * Seletor de emblemas do próprio perfil: a lista atual (até 5) e o histórico dos últimos 3 kits.
 *
 * <p>Um "kit" é um conjunto salvo: cada vez que a lista muda de verdade, o conjunto anterior entra
 * no histórico, e aplicar um kit usa as mesmas regras de posse e limite da escolha normal. Por isso
 * a tela não precisa de nenhuma ação de "salvar kit": trocar já guarda.</p>
 */
export function BadgeSelection({
  badges,
  onAddBadge,
  onRemoveBadge,
  badgeKits,
  onApplyBadgeKit,
  uploading = false,
  badgesPending = false,
  kitsLoading = false,
  initialTab = "current",
}: BadgeSelectionProps) {
  const { badgeSelection: messages, skeletonList } = useMessages();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"current" | "history">(initialTab);

  const full = badges.length >= MAX_BADGES;

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value === "history" ? "history" : "current")}
      className="space-y-2"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList className="h-8">
          <TabsTrigger value="current">{messages.currentTab}</TabsTrigger>

          <TabsTrigger value="history">
            <History className="h-3.5 w-3.5" aria-hidden />

            <>{messages.historyTab}</>
          </TabsTrigger>
        </TabsList>

        <span className="text-[11px] font-normal tabular-nums text-text-subtle">
          {messages.usage(badges.length, MAX_BADGES)}
        </span>
      </div>

      <TabsContent value="current" className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {badges.map((badge, index) => (
            <span key={`${index}-${badge}`} className="relative inline-flex shrink-0">
              <UserBadge
                badge={badge}
                className="h-10 w-10 rounded-full border border-border-soft bg-surface-1 object-cover"
              />

              <button
                type="button"
                aria-label={`${messages.remove} ${index + 1}`}
                title={`${messages.remove} ${index + 1}`}
                disabled={badgesPending}
                onClick={() => onRemoveBadge(badge)}
                className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-surface-1 text-text-subtle ring-1 ring-border-soft transition hover:text-destructive disabled:opacity-50"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}

          {full ? null : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || badgesPending}
              aria-label={messages.add}
              title={messages.add}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-dashed border-border-soft text-text-subtle transition hover:border-primary/50 hover:text-foreground disabled:opacity-50"
            >
              <Plus className={uploading ? "h-4 w-4 animate-pulse" : "h-4 w-4"} />
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={BADGE_ACCEPT}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              // Limpar o input: o navegador não dispara `change` para o MESMO arquivo duas vezes.
              event.target.value = "";
              if (file) onAddBadge(file);
            }}
          />
        </div>

        <p className="text-xs font-normal text-text-subtle">
          {full ? messages.full : messages.hint}
        </p>

        {uploading && <p className="text-xs font-normal text-text-subtle">{messages.sending}</p>}
      </TabsContent>

      <TabsContent value="history" className="space-y-2">
        {kitsLoading ? (
          <p role="status" className="text-xs font-normal text-text-subtle">
            {skeletonList.loading}
          </p>
        ) : badgeKits.length === 0 ? (
          <p className="rounded-xl bg-surface-2 px-3 py-2 text-xs font-normal text-text-subtle">
            {messages.historyEmpty}
          </p>
        ) : (
          <ul className="space-y-2">
            {badgeKits.map((kit) => (
              <li
                key={kit.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border-soft bg-surface-1 p-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex shrink-0 items-center gap-1">
                    {kit.badges.map((badge, index) => (
                      <UserBadge
                        key={`${index}-${badge}`}
                        badge={badge}
                        className="h-7 w-7 rounded-full border border-border-soft object-cover"
                      />
                    ))}
                  </div>

                  <span className="truncate text-[11px] font-normal text-text-subtle">
                    {kit.createdAtLabel}
                  </span>
                </div>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={badgesPending}
                  onClick={() => onApplyBadgeKit(kit)}
                >
                  {messages.applyKit}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}
