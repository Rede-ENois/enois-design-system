import type { DocumentoLegalAdminRascunho } from "./documento-legal-admin-rascunho.js";
import type { DocumentoLegalAdminRotulos } from "./documento-legal-admin-rotulos.js";

export type DocumentoLegalAdminProps = {
  labels: DocumentoLegalAdminRotulos;
  tipo: string;
  opcoesTipo: { valor: string; rotulo: string }[];
  onTipo: (tipo: string) => void;
  titulo: string;
  onTitulo: (titulo: string) => void;
  resumo: string;
  onResumo: (resumo: string) => void;
  conteudo: string;
  onConteudo: (conteudo: string) => void;
  rascunho: DocumentoLegalAdminRascunho;
  onEnviar: () => void;
  /** O rascunho criado; sem ele não há o que publicar (null = nada para publicar). */
  idRascunho: string | null;
  publicando: boolean;
  onPublicar: () => void;
  /** Versões já publicadas (resumo), para o admin ver o que está no ar. */
  publicados: { id: string; tipo: string; versao: number; titulo: string; vigente: boolean }[];
};
