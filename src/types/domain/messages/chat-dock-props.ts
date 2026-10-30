import type { ReactNode } from "react";

export type ChatDockProps = {
  /** Painel com a lista de conversas aberto (ou só a barra). */
  expanded: boolean;
  onToggleExpanded: () => void;
  /** Total global de não lidas, no selo da barra. */
  unreadCount: number;
  /** Mini-janelas de conversa, desenhadas à esquerda do painel (só as que cabem na tela). */
  windows?: ReactNode;
  /** As linhas da lista (`ConversationItem`), já montadas pelo app. */
  children?: ReactNode;
  empty: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  /** Which inbox the dock is showing (e.g. "Profissional"), next to the title. */
  contextLabel?: string;
};
