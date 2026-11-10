import { FileUp } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { LinkedinContactsSectionProps } from "../../types/domain/security/linkedin-contacts-section-props.js";
import { Button } from "../../ui/button.js";
import { Switch } from "../../ui/switch.js";
import { useToast } from "../../ui/toast-context.js";

/** Mesmo teto do serviço (LinkedinImportService.MAX_CONTACTS_BYTES / 5 MB no ZIP). */
const CONTACTS_MAX_MB = 5;

/**
 * Contatos do LinkedIn (Connections.csv) com convite automático no Énóis.
 *
 * O LinkedIn só entrega a lista de conexões por API para apps aprovados no programa de
 * parceiros (`r_1st_connections`); o arquivo de dados é o caminho sancionado. A importação
 * casa cada contato com uma conta daqui e, com o botão ligado, manda a solicitação de
 * conexão — sem convidar quem já é conexão, quem ainda não tem conta ou quem tem nome
 * ambíguo (duas pessoas com o mesmo nome).
 */
export function LinkedinContactsSection({
  summary,
  loadError = false,
  onRetry,
  retrying = false,
  onAutoInviteChange,
  autoInvitePending = false,
  onImport,
  importPending = false,
}: LinkedinContactsSectionProps) {
  const messages = useMessages().linkedinContactsSection;
  const { getArchive } = useMessages().linkedinImportSection;
  const { toast } = useToast();

  const detalhes = summary
    ? [
        summary.alreadyConnected ? messages.already(summary.alreadyConnected) : null,
        summary.pending ? messages.pending(summary.pending) : null,
        summary.queued ? messages.queued(summary.queued) : null,
        summary.noMatch ? messages.missing(summary.noMatch) : null,
        summary.ambiguous ? messages.ambiguous(summary.ambiguous) : null,
        summary.skipped ? messages.skipped(summary.skipped) : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div className="space-y-2 border-t border-border-soft pt-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-strong">{messages.title}</p>

          <p className="text-xs font-normal text-text-subtle">{messages.hint}</p>
        </div>

        <Switch
          checked={summary?.autoInvite ?? false}
          disabled={!summary || autoInvitePending}
          aria-label={messages.autoInvite}
          onCheckedChange={onAutoInviteChange}
        />
      </div>

      <p className="text-[11px] leading-relaxed text-text-subtle">{messages.autoInviteHint}</p>

      {loadError && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-text-subtle">{messages.loadError}</p>

          <Button
            size="sm"
            variant="outline"
            className="rounded-full"
            disabled={retrying}
            onClick={onRetry}
          >
            {messages.retry}
          </Button>
        </div>
      )}

      {summary && summary.contacts > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-text-strong">
            {messages.summary(summary.contacts, summary.invited)}
          </p>

          {detalhes && (
            <p className="text-[11px] leading-relaxed text-text-subtle">
              {messages.details(detalhes)}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-soft px-3 py-1.5 text-xs text-text-subtle transition hover:text-text-strong">
          <FileUp className="h-3.5 w-3.5" />

          <>{messages.import}</>

          <input
            type="file"
            accept=".csv,.zip,text/csv,application/zip"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              if (file.size > CONTACTS_MAX_MB * 1024 * 1024) {
                toast(messages.tooLarge(CONTACTS_MAX_MB), "error");
                return;
              }
              onImport(file);
            }}
          />
        </label>

        <a
          href="https://www.linkedin.com/psettings/member-data"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-soft px-3 py-1.5 text-xs text-text-subtle transition hover:text-text-strong"
        >
          {getArchive}
        </a>
      </div>

      <p className="text-[11px] leading-relaxed text-text-subtle">{messages.importHint}</p>

      {importPending && <p className="text-xs text-text-subtle">{messages.importing}</p>}
    </div>
  );
}
