import type { PapoJanela } from "../domain/paporeto/papo-janela.js";
import type { PapoStatus } from "../domain/paporeto/papo-status.js";

/**
 * Textos do painel do Papo Reto. Tom de conversa da rede: o painel fala do CONJUNTO, nunca de
 * uma pessoa — e diz que é medido do que já é público, não perguntado.
 */
export type PaporetoMessages = {
  papoPanel: {
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    retry: string;
    falasAnalisadas: (count: number) => string;
    semAssuntos: string;
    filtroTodos: string;
    filtroEmergente: string;
    filtroPersistente: string;
    filtroHot: string;
    statusEmergente: string;
    statusPersistente: string;
    statusHot: string;
    abrirTimeline: (subject: string) => string;
    fecharTimeline: (subject: string) => string;
    pessoas: (count: number) => string;
    falasPost: (count: number) => string;
    falasComentario: (count: number) => string;
    crescimento: (percent: number) => string;
    semCrescimento: string;
    falasUltimaHora: (count: number) => string;
    ultimas24: string;
    privacidade: string;
  };
  papoTimeline: {
    rotuloJanela: (janela: PapoJanela) => string;
    falas: (count: number) => string;
    semFalas: string;
    carregando: string;
    eixo: string;
  };
};
