import type { CalendarEntryKind } from "./calendar-entry-kind.js";
import type { CalendarParticipation } from "./calendar-participation.js";
import type { CalendarScope } from "./calendar-scope.js";

/**
 * O compromisso no detalhe: o que a tela inteira mostra, já no fuso do organizador. `cancelledAt`
 * preenchido é um compromisso cancelado — ele continua visível, com a marca, porque o convite e o
 * `.ics` precisam do mesmo id.
 */
export type CalendarEntryDetailData = {
  id: string;
  scope: CalendarScope;
  kind: CalendarEntryKind;
  title: string;
  description: string | null;
  /** `YYYY-MM-DD` no fuso do compromisso. */
  day: string;
  /** `HH:mm`, ou `null` quando é dia inteiro. */
  start: string | null;
  end: string | null;
  /** IANA id; a tela mostra como texto, não usa para recalcular. */
  timeZoneId: string;
  allDay: boolean;
  cancelledAt: string | null;
};
