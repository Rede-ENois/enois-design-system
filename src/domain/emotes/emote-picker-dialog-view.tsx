import { Search } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { EmotePickerTriggerButtonProps } from "../../types/domain/emotes/emote-picker-dialog-trigger-props.js";
import type { EmotePickerDialogViewProps } from "../../types/domain/emotes/emote-picker-dialog-view-props.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { LoadingState } from "../../ui/loading-state.js";
import { MetaLine } from "../../ui/meta-line.js";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs.js";

import { EmoteCell, EmotePageButton } from "./emote-cell.js";

/**
 * Botão que abre o seletor, onde o app o põe (barra de formatação ou barra compacta).
 *
 * É um botão comum, e não o `DialogTrigger` do Radix: o gatilho do Radix só existe dentro do
 * `<Dialog>` que ele abre, e aqui ele nasce em outro lugar da árvore — o app escolhe onde. Quem
 * fecha o ciclo é o estado que o app já guarda para o `open` do `EmotePickerDialogView`: este
 * botão pede a abertura por `onOpen` e mantém o `aria-controls` ligando os dois leitores de tela.
 */
export function EmotePickerTriggerButton({
  id,
  trigger,
  label,
  onOpen,
}: EmotePickerTriggerButtonProps) {
  return (
    <button
      type="button"
      aria-controls={id}
      aria-label={label}
      title={label}
      onClick={onOpen}
      className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-text-subtle transition hover:bg-surface-2 hover:text-primary"
    >
      {trigger}
    </button>
  );
}

/**
 * Seletor de figurinhas, no formato dos chats: busca, abas, a grade e o rodapé de páginas.
 *
 * A view não sabe de onde vêm as figurinhas (catálogo paginado, Recentes do aparelho ou pacote
 * próprio): o app decide, e o clique devolve o item — quem escolheu insere o código no texto.
 *
 * Abre o próprio diálogo (`open`/`onOpenChange`); o botão é o `EmotePickerTriggerButton`, que
 * precisa ficar ao lado (o app que desenha a barra do campo o coloca lá, e o campo pode recebê-lo
 * por `toolbarActions`/`trailingButtons`). Este é o `<Dialog>` do Radix, mas o botão não é o
 * gatilho dele: o app chama o `open` pelo `onOpen`, e o `aria-controls` liga os dois. O foco vai
 * para a busca ao abrir e volta para o ponto de partida ao fechar.
 */
export function EmotePickerDialogView({
  id,
  open,
  onOpenChange,
  onSelect,
  query,
  onQueryChange,
  tab,
  onTabChange,
  tabs,
  items,
  localTab = false,
  localTotal,
  loading = false,
  error = false,
  stale = false,
  total = 0,
  page = 1,
  totalPages = 1,
  onPageChange,
}: EmotePickerDialogViewProps) {
  const messages = useMessages().emotePickerDialog;
  const searchTerm = query.trim();
  const hasRecent = tabs.some((item) => item.value === "recent");
  // Buscar dentro de "Recentes" reaproveita o campo, mas quem responde é a lista do catálogo.
  const shownTab = hasRecent && tab === "recent" && searchTerm ? "all" : tab;
  const empty = items.length === 0;
  const shownTotal = localTotal ?? items.length;

  const grid = (
    <div className="grid grid-cols-8 gap-0.5 sm:grid-cols-10">
      {items.map((item) => (
        <EmoteCell
          key={item.code}
          code={item.code}
          src={item.src}
          onSelect={() => onSelect(item)}
        />
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent id={id} className="max-h-[85dvh] max-w-md overflow-hidden p-4">
        <DialogHeader>
          <DialogTitle>{messages.title}</DialogTitle>
        </DialogHeader>

        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-subtle" />
          <Input
            aria-label={messages.searchPlaceholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={messages.searchPlaceholder}
            className="pl-8"
            autoFocus
          />
        </div>

        <Tabs value={shownTab} onValueChange={(value) => onTabChange(value)}>
          <TabsList>
            {tabs.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {localTab ? (
          <>
            <div className="max-h-52 min-w-0 overflow-y-auto overscroll-contain pr-1">
              {empty ? <EmptyState title={messages.empty} /> : grid}
            </div>

            {shownTotal > 0 && <MetaLine>{messages.count(shownTotal)}</MetaLine>}
          </>
        ) : (
          <>
            <div
              className={`max-h-52 min-w-0 overflow-y-auto overscroll-contain pr-1 ${
                stale ? "opacity-60 transition-opacity" : ""
              }`}
              aria-busy={stale}
            >
              {loading && <LoadingState label={messages.loading} />}

              {error && <EmptyState title={messages.error} />}

              {!loading && !error && total === 0 && <EmptyState title={messages.empty} />}

              {grid}
            </div>

            {total > 0 && (
              <div className="flex items-center justify-between gap-2">
                <MetaLine>{messages.count(total)}</MetaLine>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <EmotePageButton
                      direction="previous"
                      label={messages.previous}
                      disabled={page <= 1}
                      onClick={() => onPageChange?.(page - 1)}
                    />

                    <MetaLine nowrap>{messages.page(page, totalPages)}</MetaLine>

                    <EmotePageButton
                      direction="next"
                      label={messages.next}
                      disabled={page >= totalPages}
                      onClick={() => onPageChange?.(page + 1)}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <MetaLine>{messages.hint}</MetaLine>
      </DialogContent>
    </Dialog>
  );
}
