import { useId, useRef, useState } from "react";

import { Gavel } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { ListRowSkeletons } from "../../patterns/skeletons/list-row-skeletons.js";
import type { ReportsSectionProps } from "../../types/domain/moderation/reports-section-props.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";

import { FilterSelect } from "./filter-select.js";
import { ReportCard } from "./report-card.js";
import { useReportActionFocus } from "./use-report-action-focus.js";

export function ReportsSection({
  reports,
  admin,
  loading,
  error,
  pending,
  onRetry,
  onVote,
}: ReportsSectionProps) {
  const messages = useMessages().reportsSection;
  const cardMessages = useMessages().reportCard;
  const id = useId();
  const [reason, setReason] = useState("");
  const [target, setTarget] = useState("");
  const [search, setSearch] = useState("");
  const submissionLock = useRef(false);
  const { titleRef, rememberTrigger, watchRemoval } = useReportActionFocus(reports);
  const query = search.trim().toLocaleLowerCase("pt-BR");
  const filtered = reports.filter(
    (report) =>
      (!reason || report.reason === reason) &&
      (!target || report.targetType === target) &&
      (!query ||
        [report.reportId, report.author, report.reporter, report.content, report.description].some(
          (value) => value?.toLocaleLowerCase("pt-BR").includes(query),
        )),
  );
  const reasons = [
    ...new Set([...reports.map((report) => report.reason), ...(reason ? [reason] : [])]),
  ];
  const targets = [
    ...new Set([...reports.map((report) => report.targetType), ...(target ? [target] : [])]),
  ];
  const hasFilters = !!(reason || target || search);
  const clearFilters = () => {
    setReason("");
    setTarget("");
    setSearch("");
  };
  return (
    <section
      className="min-w-0 space-y-4"
      aria-labelledby={`${id}-title`}
      aria-busy={loading || pending}
    >
      <header className="space-y-1">
        <h2
          ref={titleRef}
          tabIndex={-1}
          id={`${id}-title`}
          className="rounded-sm text-lg font-semibold text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {messages.title}
        </h2>

        <p className="text-sm text-text-subtle">{messages.description}</p>
      </header>
      {loading ? (
        <div role="status" aria-label={messages.loading}>
          <ListRowSkeletons />
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-2xl border border-border-soft bg-surface-card p-4">
          <p role="alert" className="text-sm text-text-strong">
            {messages.error}
          </p>

          <Button type="button" variant="outline" onClick={onRetry} disabled={pending}>
            {messages.retry}
          </Button>
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-2xl border border-border-soft bg-surface-card">
          <EmptyState icon={Gavel} title={messages.empty} />
        </div>
      ) : (
        <>
          <div className="space-y-3 rounded-2xl border border-border-soft bg-surface-card p-4">
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <FilterSelect
                  id={`${id}-reason`}
                  label={messages.filterReason}
                  allLabel={messages.allReasons}
                  value={reason}
                  onChange={setReason}
                  options={reasons}
                  labels={cardMessages.reasons}
                />
              </div>

              <div className="min-w-0 space-y-2">
                <FilterSelect
                  id={`${id}-target`}
                  label={messages.filterTarget}
                  allLabel={messages.allTargets}
                  value={target}
                  onChange={setTarget}
                  options={targets}
                  labels={cardMessages.targets}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${id}-search`}>{messages.search}</Label>

              <Input
                id={`${id}-search`}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={messages.searchPlaceholder}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <p role="status" className="text-sm text-text-subtle">
                {messages.count(filtered.length, reports.length)}
              </p>
              {hasFilters && (
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                  {messages.clearFilters}
                </Button>
              )}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border-soft bg-surface-card p-4">
              <EmptyState
                icon={Gavel}
                title={messages.noFiltered}
                description={messages.noFilteredHint}
              />

              <Button type="button" variant="outline" onClick={clearFilters}>
                {messages.clearFilters}
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((report) => (
                <ReportCard
                  key={report.reportId}
                  report={report}
                  admin={admin}
                  pending={pending}
                  onVote={(reportId, vote) => {
                    if (pending || submissionLock.current) return;
                    rememberTrigger();
                    watchRemoval(reportId);
                    onVote(reportId, vote);
                  }}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
