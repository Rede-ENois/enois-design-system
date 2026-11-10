import type { CalendarAnswer } from "./calendar-answer.js";
import type { CalendarEntryDetailData } from "./calendar-entry-detail-data.js";
import type { CalendarEntryDetailParticipant } from "./calendar-entry-detail-participant.js";
import type { CalendarParticipation } from "./calendar-participation.js";

/**
 * A tela de detalhe de um compromisso. O app busca, muta e navega; este componente desenha e
 * reporta o clique.
 *
 * `participants` é `null` para quem foi convidado: ser convidado não dá o direito de ver quem mais
 * foi, e o servidor já não manda a lista nesse caso. `owner` decide quais ações aparecem.
 */
export type CalendarEntryDetailProps = {
  entry: CalendarEntryDetailData;
  /** Quem lê organiza o compromisso. Falso é convidado. */
  owner: boolean;
  /** Resposta de quem lê; `null` para o organizador, que não tem linha de participante. */
  participation: CalendarParticipation | null;
  /** Convidados, só para o organizador (o servidor manda `null` para o convidado). */
  participants: CalendarEntryDetailParticipant[] | null;
  /** Rótulo do botão de voltar (o app decide a palavra: "Voltar" ou o nome da agenda). */
  backLabel: string;
  onBack: () => void;
  /** Abrir o formulário de edição; ausente esconde o botão. */
  onEdit?: () => void;
  /** Cancelar o compromisso; ausente esconde o botão. */
  onCancel?: () => void;
  /** Registrar a própria resposta; ausente esconde as ações de resposta. */
  onRespond?: (answer: CalendarAnswer) => void;
  /** Remover um convidado; ausente esconde o botão de cada linha. */
  onRemoveParticipant?: (participantId: string) => void;
  /** Convidar pelo @; ausente esconde o campo. Resolve `true` quando o servidor aceitou. */
  onInvite?: (username: string) => Promise<boolean>;
  /** Há uma edição/cancelamento em voo. */
  saving?: boolean;
  /** Há uma resposta em voo. */
  responding?: boolean;
  /** Há um convite em voo. */
  invitePending?: boolean;
  /** Recusa devolvida pelo servidor na edição (o formulário já mostra o que foi digitado). */
  error?: string | null;
  /** Recusa devolvida pelo servidor no convite; some quando o campo é reenviado. */
  inviteError?: string | null;
};
