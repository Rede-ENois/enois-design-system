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
    /** A frase longa do crescimento, para a linha de detalhe do assunto. */
    crescimento: (percent: number) => string;
    /** O percentual curto da pílula ("+25%"). */
    crescimentoCurto: (percent: number) => string;
    /** Assunto sem véspera comparável: diz que é novo, não inventa percentual. */
    novoEmAlta: string;
    semCrescimento: string;
    pessoasRotulo: string;
    falasPostRotulo: string;
    falasComentarioRotulo: string;
    falasUltimaHoraRotulo: string;
    /** Rótulo da amostra pequena: o assunto existe, mas sai de poucas pessoas. */
    amostragemMenor: (pessoas: number) => string;
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
  /**
   * Textos das publicações relacionadas ao assunto aberto. Aqui o painel desce do conjunto para
   * o que já era público: o texto de quem falou do assunto, com o nome de quem escolheu falar.
   */
  papoPublicacoes: {
    titulo: string;
    tituloDoAssunto: (subject: string) => string;
    contagem: (count: number) => string;
    carregando: string;
    erro: string;
    retry: string;
    vazio: string;
    semAutor: string;
    abrir: string;
    fontePost: string;
    fonteComentario: string;
    fonteDesabafo: string;
    fonteConfissao: string;
  };
};
