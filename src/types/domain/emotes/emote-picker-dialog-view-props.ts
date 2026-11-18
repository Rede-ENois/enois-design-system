import type { EmotePickerItem } from "./emote-picker-item.js";
import type { EmotePickerTab } from "./emote-picker-tab.js";

/**
 * Seletor de figurinhas: o app escolhe o que aparece (Recentes, pacote próprio ou a página do
 * catálogo) e o clique devolve o item; a view desenha header, busca, abas, grade, estados e rodapé.
 */
export type EmotePickerDialogViewProps = {
  /** Id do diálogo: o `EmotePickerTriggerButton` abre este seletor por `aria-controls`. */
  id?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: EmotePickerItem) => void;
  /** Texto da busca (o app aplica a pausa antes de consultar o backend). */
  query: string;
  onQueryChange: (query: string) => void;
  /** Aba aberta. */
  tab: string;
  onTabChange: (tab: string) => void;
  /** Abas visíveis, na ordem; a de recentes só aparece quando há recentes. */
  tabs: EmotePickerTab[];
  /** Itens da aba aberta. */
  items: EmotePickerItem[];
  /** Aba desenha uma lista do app (Recentes, pacote próprio): sem carregando/erro/página. */
  localTab?: boolean;
  /** Quantidade da aba local, quando difere do que está desenhado. */
  localTotal?: number;
  loading?: boolean;
  error?: boolean;
  /** Página chegando: a grade anterior continua, apagada, até a nova. */
  stale?: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};
