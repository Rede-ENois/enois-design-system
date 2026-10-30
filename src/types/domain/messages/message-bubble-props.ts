import type { ReactNode } from "react";

import type { ConversationPeerData } from "./conversation-peer-data.js";
import type { MessageBubbleData } from "./message-bubble-data.js";

export type MessageBubbleProps = {
  message: MessageBubbleData;
  /** A mensagem é de quem está olhando a tela: muda o lado, a cor e o canto do balão. */
  isMe: boolean;
  /** Perfil do outro participante — avatar e link ao lado das mensagens dele. */
  peer?: ConversationPeerData | null;
  profileHref: string;
  /** Texto formatado da mensagem; ausente quando a mensagem só tem mídia. */
  content?: ReactNode;
  /** Mídias anexadas; ausente quando não há. */
  media?: ReactNode;
  /** Hora da mensagem, já formatada pelo app. */
  timeLabel: string;
  /** Emoji de cada tipo de reação, na ordem do seletor. */
  emojis: Record<string, string>;
  /** Modo de seleção de mensagens: o clique passa a marcar o balão. */
  selecting?: boolean;
  selected?: boolean;
  /** Ausente quando o balão não aceita clique (filão da conversa anterior ainda na tela). */
  onToggleSelect?: () => void;
  /** Reagir ou desfazer. Ausente nas mesmas condições da seleção. */
  onReact?: (type: string) => void;
  /** Recibo de leitura: a outra pessoa já abriu a conversa depois desta mensagem. */
  readByOther?: boolean;
  /** Denunciar esta mensagem. Ausente nas mensagens próprias e onde não se denuncia. */
  onReport?: () => void;
  /** Responder esta mensagem. */
  onReply?: () => void;
  /** Citação da mensagem sendo respondida (acima do conteúdo do balão). */
  replyQuote?: { from: string; text: string; isMe: boolean } | null;
};
