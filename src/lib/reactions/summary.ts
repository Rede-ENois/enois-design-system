import type { ReactionCountSummary } from "../../types/lib/reactions/reaction-count-summary.js";
import type { ReactionTab } from "../../types/lib/reactions/reaction-tab.js";

/** Soma 1 ao tipo, sem tocar no resumo recebido (o cache do React Query é imutável). */
export function applyReactionToSummary<T extends string>(
  summary: ReactionCountSummary<T>,
  type: T,
): ReactionCountSummary<T> {
  const next: ReactionCountSummary<T> = { ...summary };
  next[type] = (next[type] ?? 0) + 1;
  return next;
}

/**
 * Tira 1 do tipo. O contador nunca fica negativo e a chave some quando zera — é assim que a pílula
 * deixa de existir para quem ficou sem ninguém (e a aba do diálogo some junto).
 */
export function removeReactionFromSummary<T extends string>(
  summary: ReactionCountSummary<T>,
  type: T,
): ReactionCountSummary<T> {
  const next: ReactionCountSummary<T> = { ...summary };
  const count = (next[type] ?? 0) - 1;

  if (count > 0) next[type] = count;
  else delete next[type];

  return next;
}

/** Abas do diálogo: só tipos com gente, do maior para o menor (empate preserva a ordem). */
export function buildReactionTabs<T extends string>(
  summary: ReactionCountSummary<T>,
): ReactionTab<T>[] {
  return (Object.entries(summary) as [T, number][])
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({ type, count }));
}

/** Quantas bolinhas o contador de reações mostra por padrão. */
export const TOP_REACTIONS = 3;

/**
 * As reações mais usadas de uma publicação, do maior para o menor (empate preserva a ordem do
 * summary), limitadas a `max` — é o que as bolinhas sobrepostas do contador exibem.
 */
export function topReactionTabs<T extends string>(
  summary: ReactionCountSummary<T>,
  max = TOP_REACTIONS,
): ReactionTab<T>[] {
  return buildReactionTabs(summary).slice(0, max);
}

/**
 * Ordena as abas sem reordenar o que já estava na tela: a ordem anterior é preservada e só as
 * contagens são atualizadas. Tipo novo entra na posição ditada pela contagem e tipo zerado sai.
 *
 * Isso evita a pílula "fugindo do dedo": como o resumo é otimista, reordenar a cada clique moveria
 * o alvo no meio do toque. A ordenação por contagem só acontece quando a lista ainda está vazia
 * (primeiro carregamento) ou quando um tipo inédito aparece.
 */
export function sortReactionTabsStable<T extends string>(
  previousTabs: ReactionTab<T>[],
  summary: ReactionCountSummary<T>,
): ReactionTab<T>[] {
  if (previousTabs.length === 0) return buildReactionTabs(summary);

  const tabs = previousTabs.flatMap((tab) => {
    const count = summary[tab.type] ?? 0;
    return count > 0 ? [{ type: tab.type, count }] : [];
  });
  const known = new Set(tabs.map((tab) => tab.type));

  const newTabs = (Object.entries(summary) as [T, number][])
    .filter(([type, count]) => count > 0 && !known.has(type))
    .sort(([, a], [, b]) => b - a);

  for (const [type, count] of newTabs) {
    const index = tabs.findIndex((tab) => tab.count < count);
    if (index === -1) tabs.push({ type, count });
    else tabs.splice(index, 0, { type, count });
  }

  return tabs;
}
