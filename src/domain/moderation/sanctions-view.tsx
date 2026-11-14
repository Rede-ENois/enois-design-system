import { useId } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { SanctionsViewProps } from "../../types/domain/moderation/sanctions-view-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { LoadingState } from "../../ui/loading-state.js";

import { SanctionAppealForm } from "./sanction-appeal-form.js";
import { SanctionDate, SanctionDetails } from "./sanction-details.js";

export function SanctionsView(props: SanctionsViewProps) {
  const {
    mode,
    loading,
    error,
    refreshing,
    sanctions,
    appeals,
    now,
    onRetry,
    backHref,
    loginHref,
    appealSanctionId,
    onAppealSanctionChange,
    appealSubmitting,
  } = props;
  const selectId = useId();
  const eligible = sanctions.filter((sanction) => sanction.canAppeal);
  const targetId = appealSanctionId ?? eligible[0]?.id;
  const messages = useMessages().sanctionsView;
  return (
    <section className="min-w-0 space-y-4">
      <h1 className="text-xl font-semibold text-text-strong">
        {mode === "suspended" ? messages.suspendedTitle : messages.historyTitle}
      </h1>
      {loading ? (
        <LoadingState label={messages.loading} />
      ) : error ? (
        <div className="space-y-3">
          <p role="alert" className="text-sm text-text-strong">
            {messages.loadError}
          </p>

          <Button
            variant="outline"
            className="text-text-strong hover:text-text-strong"
            onClick={onRetry}
            disabled={refreshing}
          >
            {messages.retry}
          </Button>
        </div>
      ) : sanctions.length === 0 ? (
        <EmptyState title={messages.empty} />
      ) : (
        <>
          <div role="status" aria-live="polite">
            {refreshing && <p className="text-sm text-text-strong">{messages.refreshing}</p>}
          </div>
          {eligible.length > 1 && onAppealSanctionChange && (
            <div className="space-y-2">
              <label htmlFor={selectId} className="text-sm font-medium text-text-strong">
                {messages.appealTarget}
              </label>

              <select
                id={selectId}
                value={targetId ?? ""}
                onChange={(event) => onAppealSanctionChange(event.target.value)}
                disabled={appealSubmitting}
                className="w-full rounded-md border border-input bg-background p-2 text-base text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
              >
                {eligible.map((sanction) => (
                  <option key={sanction.id} value={sanction.id}>
                    {messages.appealTargetOption(messages.type[sanction.type], sanction.id)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <ul className="space-y-4">
            {sanctions.map((sanction) => {
              const history = appeals.filter((appeal) => appeal.sanctionId === sanction.id);
              const pending = history.some((appeal) => appeal.status === "PENDING");
              return (
                <li
                  key={sanction.id}
                  data-sanction-id={sanction.id}
                  className="min-w-0 space-y-4 rounded-2xl border border-border-soft bg-surface-card p-4 sm:p-6"
                >
                  <SanctionDetails sanction={sanction} now={now} />
                  {history.length > 0 && (
                    <div className="space-y-2 text-sm text-text-strong">
                      <h3 className="font-semibold">{messages.appealHistory}</h3>

                      <ul className="space-y-3">
                        {history.map((appeal) => (
                          <li key={appeal.id} className="min-w-0 space-y-1">
                            <p
                              className="font-medium"
                              role={appeal.status === "PENDING" ? "status" : undefined}
                            >
                              {messages.appealStatus[appeal.status]}
                            </p>

                            <SanctionDate at={appeal.createdAt} />

                            <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                              {appeal.message}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {sanction.canAppeal && !pending && sanction.id === targetId && (
                    <SanctionAppealForm key={sanction.id} {...props} />
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
      {(backHref || loginHref) && (
        <div className="flex flex-wrap gap-4 text-sm text-text-strong">
          {backHref && (
            <AppLink
              href={backHref}
              className="rounded underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {messages.back}
            </AppLink>
          )}
          {loginHref && (
            <AppLink
              href={loginHref}
              className="rounded underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {messages.login}
            </AppLink>
          )}
        </div>
      )}
    </section>
  );
}
