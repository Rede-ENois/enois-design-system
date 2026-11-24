import type { ReactNode } from "react";

import type { MuralResumo } from "./mural-resumo.js";

export type MuralQuadroProps = {
  mural: MuralResumo;
  /** Quem vê é o dono: as ações de editar e remover o quadro aparecem. */
  ehDono: boolean;
  onEditar: () => void;
  onRemover: () => void;
  /** Colar uma publicação: chega id ou link, o app extrai e decide se pode. */
  onColar: (postIdOuLink: string) => void;
  colando: boolean;
  /** Aviso de recusa da colagem (post inexistente, já colado, sem permissão). */
  colarErro: string | null;
  /**
   * O conteúdo do menu de compartilhar o mural (copiar link, enviar, compartilhar do aparelho).
   * Os itens são botões de quem compõe: o endereço do mural é quem compõe que sabe.
   */
  compartilhar?: ReactNode;
  /** Os cartões das publicações coladas (o card do feed vem de quem compõe). */
  children: ReactNode;
};
