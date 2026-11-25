import type { ReactNode } from "react";

import type { DocumentoLegalPendente } from "./documento-legal-pendente.js";
import type { DocumentoLegalRotulos } from "./documento-legal-rotulos.js";
import type { DocumentoLegalTexto } from "./documento-legal-texto.js";

export type DocumentoLegalPaginaProps = {
  /** O título da tela (h1). */
  title: string;
  intro: string;
  /** Só com sessão: sem ela, não há aceite a mostrar (a leitura pública fica nos links). */
  logado: boolean;
  state: "loading" | "error" | "ready";
  loadingLabel: string;
  errorLabel: string;
  /** Em vigor e ainda não aceitas, na ordem em que o servidor mandou. */
  pendentes: DocumentoLegalPendente[];
  /** O texto aberto, já renderizado pelo editor do app (`children`). `null` sem pendência. */
  texto: DocumentoLegalTexto | null;
  children?: ReactNode;
  aceitandoId: string | null;
  /** `null` quando a pessoa ainda não pode aceitar (sem texto aberto, por exemplo). */
  onAceitar: (() => void) | null;
  labels: DocumentoLegalRotulos;
  /** Abre a versão em vigor daquele tipo (o link com o texto atual). */
  onLerAtual: (tipo: string) => void;
  /** Histórico de versões; vazio esconde a seção. */
  historico: {
    tipo: string;
    versao: number;
    titulo: string;
    vigente: boolean;
    onAbrir: () => void;
  }[];
};
