import type { ReactNode } from "react";

import type { ColecaoResumo } from "./colecao-resumo.js";

export type ColecaoQuadroProps = {
  colecao: ColecaoResumo;
  /** A coleção é sua por definição: editar e remover aparecem sempre. */
  onEditar: () => void;
  onRemover: () => void;
  /** Guardar uma publicação salva: chega id ou link, o app extrai e decide se pode. */
  onGuardar: (postIdOuLink: string) => void;
  guardando: boolean;
  /** Aviso de recusa do guardar (post não salvo, já guardado, inexistente). */
  guardarErro: string | null;
  /** Os cartões das publicações guardadas (o card do feed vem de quem compõe). */
  children: ReactNode;
};
