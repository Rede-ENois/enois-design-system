import { useState } from "react";

import { GripVertical } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { RecruitmentBatchTarget } from "../../types/domain/jobs/recruitment-batch-target.js";
import type { RecruitmentBoardProps } from "../../types/domain/jobs/recruitment-board-props.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";
import { Select } from "../../ui/select.js";

import { RecruitmentScoreLine } from "./recruitment-score-line.js";

/**
 * The hiring funnel as columns: one per stage, plus the entrance column of a flow that is not
 * configured yet and the column of applications that left the process.
 *
 * Selection is a real checkbox next to each card (keyboard reachable, screen-reader named), not a
 * drag gesture: moving a batch forward is a decision the recruiter makes on purpose, and cards do
 * not move on an accidental drag. The stage select applies the move to everything selected.
 */
export function RecruitmentBoard({
  stages,
  columns,
  rejected,
  summary,
  selectedIds,
  onToggleSelected,
  onOpen,
  onBatchMove,
  pending = false,
  error = null,
  resultNote = null,
}: RecruitmentBoardProps) {
  const messages = useMessages().recruitment;
  const selected = new Set(selectedIds);
  const canMove = selected.size > 0 && !pending;
  // O alvo do select é o mesmo para os três botões: o backend exige etapa para avançar e recusa
  // movimento de quem já saiu; REJECT não usa a etapa (fromStageId = toStageId no movimento).
  const [targetId, setTargetId] = useState("");

  const move = (kind: RecruitmentBatchTarget["kind"]) => {
    const stage = stages.find((stage) => stage.id === targetId) ?? null;
    onBatchMove({ kind, stageId: kind === "REJECT" ? null : (stage?.id ?? null) });
  };

  return (
    <section aria-label={messages.summaryTotal(summary.total)} className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{messages.summaryTotal(summary.total)}</Badge>

        <Badge variant="secondary">{messages.summaryInProcess(summary.inProcess)}</Badge>

        <Badge variant="secondary">{messages.summaryRejected(summary.rejected)}</Badge>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {resultNote && (
        <p className="rounded-xl bg-muted px-4 py-3 text-sm text-foreground" role="status">
          {resultNote}
        </p>
      )}

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border-soft p-3">
          <span className="text-sm font-medium text-text-strong">
            {messages.selectedCount(selected.size)}
          </span>

          <Select
            aria-label={messages.moveTo}
            value={targetId}
            className="h-9 w-auto max-w-56"
            disabled={pending}
            onChange={(event) => setTargetId(event.target.value)}
          >
            <option value="">{messages.moveTargetPlaceholder}</option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.name}
              </option>
            ))}
          </Select>

          <Button
            variant="outline"
            size="sm"
            disabled={!canMove || !targetId}
            onClick={() => move("ADVANCE")}
          >
            {messages.advance}
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={!canMove || !targetId}
            onClick={() => move("RETURN")}
          >
            {messages.returnTo}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={!canMove}
            onClick={() => move("REJECT")}
          >
            {messages.reject}
          </Button>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((column) => {
          const stage = stages.find((candidate) => candidate.id === column.stageId) ?? null;
          const title = stage ? stage.name : messages.entranceColumn;
          return (
            <div
              key={column.stageId ?? "entrance"}
              className="flex w-72 shrink-0 flex-col gap-2 rounded-2xl border border-border-soft bg-surface-1 p-2"
            >
              <div className="flex items-center justify-between gap-2 px-1">
                <h3 className="truncate text-sm font-semibold text-text-strong">{title}</h3>

                <Badge variant="outline">{messages.stageCount(column.cards.length)}</Badge>
              </div>

              {column.cards.length === 0 && (
                <p className="px-1 py-3 text-xs text-muted-foreground">{messages.emptyStage}</p>
              )}

              {column.cards.map((card) => (
                <article
                  key={card.applicationId}
                  className={cn(
                    "surface-card flex flex-col gap-2 rounded-xl p-3",
                    selected.has(card.applicationId) && "border-primary/60 bg-primary-soft/40",
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border",
                        selected.has(card.applicationId)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border-soft bg-surface-1",
                      )}
                    >
                      <GripVertical className="h-3.5 w-3.5" />
                    </span>

                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selected.has(card.applicationId)}
                      onChange={() => onToggleSelected(card.applicationId)}
                      aria-label={messages.selectApplication(card.name)}
                    />

                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        className="block w-full truncate text-left text-sm font-medium text-text-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        onClick={() => onOpen(card.applicationId)}
                        aria-label={messages.openFileFor(card.name)}
                      >
                        {card.name}
                      </button>

                      {card.headline && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {card.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline">{card.statusLabel}</Badge>

                    <RecruitmentScoreLine score={card.score} />
                  </div>
                </article>
              ))}
            </div>
          );
        })}

        <div className="flex w-72 shrink-0 flex-col gap-2 rounded-2xl border border-border-soft bg-surface-1 p-2">
          <div className="flex items-center justify-between gap-2 px-1">
            <h3 className="truncate text-sm font-semibold text-text-strong">
              {messages.rejectedColumn}
            </h3>

            <Badge variant="outline">{messages.stageCount(rejected.length)}</Badge>
          </div>

          {rejected.length === 0 && (
            <p className="px-1 py-3 text-xs text-muted-foreground">{messages.emptyStage}</p>
          )}

          {rejected.map((card) => (
            <article key={card.applicationId} className="surface-card rounded-xl p-3 opacity-80">
              <button
                type="button"
                className="block w-full truncate text-left text-sm font-medium text-text-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                onClick={() => onOpen(card.applicationId)}
                aria-label={messages.openFileFor(card.name)}
              >
                {card.name}
              </button>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline">{card.statusLabel}</Badge>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
