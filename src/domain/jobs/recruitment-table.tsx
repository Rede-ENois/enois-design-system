import { useState } from "react";

import { ChevronDown, Loader2, Search } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { RecruitmentBatchTarget } from "../../types/domain/jobs/recruitment-batch-target.js";
import type { RecruitmentStatus } from "../../types/domain/jobs/recruitment-status.js";
import type { RecruitmentTableProps } from "../../types/domain/jobs/recruitment-table-props.js";
import { Badge } from "../../ui/badge.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Select } from "../../ui/select.js";

import { RecruitmentScoreLine } from "./recruitment-score-line.js";

/**
 * The same applications as the board, as a paginated table: one cursor page at a time, with a
 * page checkbox (`sr-only` over a drawn mark, the pattern of the moderation list) and "load more"
 * appending the next page from the API cursor. The filters drive the server query; the component
 * never filters what the backend already filtered.
 */
export function RecruitmentTable({
  rows,
  stages,
  statusOptions,
  statusFilter,
  onStatusFilter,
  search,
  onSearch,
  selectedIds,
  onToggleSelected,
  onTogglePage,
  onOpen,
  onBatchMove,
  hasMore,
  loadingMore = false,
  onLoadMore,
  loading = false,
  pending = false,
  error = null,
  resultNote = null,
}: RecruitmentTableProps) {
  const messages = useMessages().recruitment;
  const selected = new Set(selectedIds);
  const allOnPage = rows.length > 0 && rows.every((row) => selected.has(row.applicationId));
  const stageName = (stageId: string | null) =>
    stages.find((stage) => stage.id === stageId)?.name ?? null;
  const canMove = selected.size > 0 && !pending;
  // O alvo do select é o mesmo para os três botões: o backend exige etapa para avançar e recusa
  // movimento de quem já saiu; REJECT não usa a etapa (fromStageId = toStageId no movimento).
  const [targetId, setTargetId] = useState("");

  const move = (kind: RecruitmentBatchTarget["kind"]) => {
    const stage = stages.find((stage) => stage.id === targetId) ?? null;
    onBatchMove({ kind, stageId: kind === "REJECT" ? null : (stage?.id ?? null) });
  };

  return (
    <section className="space-y-3" aria-label={messages.candidateColumn}>
      <div className="flex flex-wrap items-end gap-2">
        <div className="w-full max-w-64">
          <Label htmlFor="recruitment-search">{messages.searchLabel}</Label>

          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="recruitment-search"
              type="search"
              value={search}
              placeholder={messages.searchPlaceholder}
              className="pl-8"
              onChange={(event) => onSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="w-full max-w-48">
          <Label htmlFor="recruitment-status">{messages.statusColumn}</Label>

          <Select
            id="recruitment-status"
            value={statusFilter ?? ""}
            onChange={(event) =>
              onStatusFilter((event.target.value || null) as RecruitmentStatus | null)
            }
          >
            <option value="">{messages.filterAll}</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

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

      {loading ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          {messages.loadingMore}
        </p>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border-soft px-4 py-8 text-center text-sm text-muted-foreground">
          <p className="font-medium text-text-strong">{messages.empty}</p>

          <p className="mt-1">{messages.emptyHint}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border-soft">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <caption className="sr-only">{messages.rowsShown(rows.length)}</caption>

              <thead>
                <tr className="border-b border-border-soft bg-surface-1">
                  <th scope="col" className="w-10 px-3 py-2">
                    <span
                      aria-hidden
                      className={cn(
                        "grid h-5 w-5 place-items-center rounded-md border",
                        allOnPage
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border-soft bg-surface-card",
                      )}
                    >
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                    </span>

                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={allOnPage}
                      onChange={(event) => onTogglePage(event.target.checked)}
                      aria-label={messages.selectPage}
                    />
                  </th>

                  <th scope="col" className="px-3 py-2 font-medium text-muted-foreground">
                    {messages.candidateColumn}
                  </th>

                  <th scope="col" className="px-3 py-2 font-medium text-muted-foreground">
                    {messages.stageColumn}
                  </th>

                  <th scope="col" className="px-3 py-2 font-medium text-muted-foreground">
                    {messages.statusColumn}
                  </th>

                  <th scope="col" className="px-3 py-2 font-medium text-muted-foreground">
                    {messages.scoreColumn}
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.applicationId}
                    className={cn(
                      "border-b border-border-soft last:border-b-0",
                      selected.has(row.applicationId) && "bg-primary-soft/40",
                    )}
                  >
                    <td className="px-3 py-2">
                      <span
                        aria-hidden
                        className={cn(
                          "grid h-5 w-5 place-items-center rounded-md border",
                          selected.has(row.applicationId)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border-soft bg-surface-card",
                        )}
                      />
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected.has(row.applicationId)}
                        onChange={() => onToggleSelected(row.applicationId)}
                        aria-label={messages.selectApplication(row.name)}
                      />
                    </td>

                    <td className="max-w-56 px-3 py-2">
                      <button
                        type="button"
                        className="block w-full truncate text-left font-medium text-text-strong hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        onClick={() => onOpen(row.applicationId)}
                        aria-label={messages.openFileFor(row.name)}
                      >
                        {row.name}
                      </button>
                      {row.headline && (
                        <p className="truncate text-xs text-muted-foreground">{row.headline}</p>
                      )}
                    </td>

                    <td className="max-w-40 truncate px-3 py-2 text-muted-foreground">
                      {stageName(row.stageId) ?? messages.entranceColumn}
                    </td>

                    <td className="px-3 py-2">
                      <Badge variant="outline">{row.statusLabel}</Badge>
                    </td>

                    <td className="px-3 py-2">
                      <RecruitmentScoreLine score={row.score} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{messages.rowsShown(rows.length)}</p>
            {hasMore && (
              <Button variant="outline" size="sm" disabled={loadingMore} onClick={onLoadMore}>
                {loadingMore && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
                {loadingMore ? messages.loadingMore : messages.loadMore}
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
