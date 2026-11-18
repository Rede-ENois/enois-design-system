import type { ReactNode } from "react";

import type { PostDestinoItem } from "./post-destino-item.js";

/**
 * Para onde o post pode ir sem sair do card: murais (colar) e coleções (guardar). O app busca
 * as listas e o diálogo só desenha: aba ativa, itens com a marca "tem", pendings por destino.
 */
export type PostDestinosDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** O post em questão: os destinos já sabem se ele está lá (flag `tem`). */
  postId: string;
  murais: PostDestinoItem[];
  colecoes: PostDestinoItem[];
  /** Listas ainda vindo do backend: as abas mostram "carregando" em vez de vazio. */
  carregando?: boolean;
  /** Murais/coleções sendo colados/guardados agora (ids), para travar o clique repetido. */
  pendentes: ReadonlySet<string>;
  /** Erro da última tentativa: o item que falhou (ou null) e a mensagem. */
  erro: { destinoId: string | null; mensagem: string } | null;
  /** Cola o post no mural escolhido. */
  onColarNoMural: (muralId: string) => void;
  /** Guarda o post na coleção escolhida. O app salva antes, se preciso. */
  onGuardarNaColecao: (colecaoId: string) => void;
  /** Slot para o app oferecer "criar mural/coleção" por cima, se quiser. */
  footer?: ReactNode;
};
