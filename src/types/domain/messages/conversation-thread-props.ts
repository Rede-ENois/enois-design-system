import type { ReactNode } from "react";

import type { ConversationPeerData } from "./conversation-peer-data.js";
import type { ConversationSendValues } from "./conversation-send-values.js";
import type { ConversationServiceOption } from "./conversation-service-option.js";

export type ConversationThreadProps = {
  conversationTitle?: string | null;
  peer?: ConversationPeerData | null;
  profileHref: string;
  /** Voltar para a lista — só no mobile, onde a tela inteira troca de lista para filão. */
  onBack?: () => void;
  /** Shown between the header and the messages (e.g. the E2eSetupBanner). */
  banner?: ReactNode;
  /**
   * Gate E2E: sem a chave local a conversa não abre. Esconde o histórico e o compositor e
   * centraliza o `banner` com o aviso de que a criptografia é obrigatória.
   */
  e2eRequired?: boolean;
  /** Os balões, já montados pelo app, do mais antigo ao mais novo. */
  children?: ReactNode;
  loading: boolean;
  empty: boolean;
  /** Id da mensagem mais nova: quando muda, o quadro rola para o fim. */
  newestMessageId: string | null;
  hasOlderMessages: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  selecting: boolean;
  selectedCount: number;
  onStartSelecting: () => void;
  onCancelSelection: () => void;
  deletePending: boolean;
  onDeleteSelected: () => void;
  sendPending: boolean;
  /** Sobe as imagens e envia; rejeita quando a subida falhou (o erro aparece no compositor). */
  onSend: (values: ConversationSendValues) => Promise<void>;
  servicesOpen: boolean;
  onServicesOpenChange: (open: boolean) => void;
  servicesLoading: boolean;
  services: ConversationServiceOption[];
  /** Endereço do serviço anexado (o app sabe onde a oferta mora). */
  serviceHref: (serviceId: string) => string;
  /** Mensagem sendo respondida (exibe preview acima do compositor). */
  replyingTo?: { id: string; from: string; text: string } | null;
  onCancelReply?: () => void;
};
