import { useState } from "react";

import { ClipboardPaste, FileUp } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { LinkedinImportSectionProps } from "../../types/domain/security/linkedin-import-section-props.js";
import { Button } from "../../ui/button.js";
import { Textarea } from "../../ui/textarea.js";
import { useToast } from "../../ui/toast.js";

/**
 * Importar o ARQUIVO DE DADOS do LinkedIn (Configurações → "Obter uma cópia dos seus
 * dados" → ZIP). O backend parseia e DEVOLVE o retrato; nada é salvo automaticamente —
 * a pessoa marca o que quer e o app cria experiencias, formação, certificações e
 * projetos pelos endpoints normais.
 */
/** Mesmo teto do serviço (LinkedinImportService.MAX_ZIP_BYTES). */
const LINKEDIN_ZIP_MAX_MB = 5;

/** Teto do currículo (o backend aceita PDF de até 10 MB; texto tem teto próprio). */
const RESUME_MAX_MB = 10;

export function LinkedinImportSection({
  linkedinConnected = false,
  preview,
  selected,
  onToggle,
  pasteOpen,
  onPasteOpenChange,
  onImportArchive,
  archivePending = false,
  onImportText,
  textPending = false,
  onImportResume,
  resumePending = false,
  onSave,
  savePending = false,
  onCancelPreview,
  contactsSection,
}: LinkedinImportSectionProps) {
  const messages = useMessages().linkedinImportSection;
  const { toast } = useToast();
  const [texto, setTexto] = useState("");

  const linhas = preview
    ? [
        ...(preview.profile
          ? [
              {
                key: "perfil",
                label:
                  `${messages.profileRow}${preview.profile.headline ?? "—"}` +
                  (preview.profile.location ? ` · ${preview.profile.location}` : "") +
                  (preview.profile.summary ? messages.profileRowSummary : ""),
              },
            ]
          : []),
        ...(preview.skills?.length
          ? [
              {
                key: "skills",
                label: `${messages.skillsRow}${preview.skills.slice(0, 8).join(", ")}${preview.skills.length > 8 ? "…" : ""}`,
              },
            ]
          : []),
        ...preview.experiences.map((exp, i) => ({
          key: `exp${i}`,
          label: `${exp.title ?? ""} · ${exp.company ?? ""}`,
        })),
        ...preview.education.map((edu, i) => ({
          key: `edu${i}`,
          label: `${edu.school} · ${edu.degree || edu.field || ""}`,
        })),
        ...preview.certifications.map((cert, i) => ({ key: `cert${i}`, label: cert.name })),
        ...preview.projects.map((project, i) => ({ key: `proj${i}`, label: project.title })),
      ]
    : [];

  return (
    <div className="space-y-2 border-t border-border-soft pt-3">
      <p className="text-xs font-medium text-text-strong">{messages.title}</p>

      <p className="text-xs font-normal text-text-subtle">
        {linkedinConnected ? messages.hint : messages.connectFirst}
      </p>

      {!preview && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={pasteOpen ? "default" : "outline"}
              className="rounded-full gap-1.5"
              onClick={() => onPasteOpenChange(!pasteOpen)}
            >
              <ClipboardPaste className="h-3.5 w-3.5" />

              <>{messages.pasteToggle}</>
            </Button>

            <a
              href="https://www.linkedin.com/psettings/member-data"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-soft px-3 py-1.5 text-xs text-text-subtle transition hover:text-text-strong"
            >
              {messages.getArchive}
            </a>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border-soft px-3 py-1.5 text-xs text-text-subtle transition hover:text-text-strong">
              {messages.button}
              <input
                type="file"
                accept=".zip"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  // Mesmo teto do serviço (5 MB): avisar antes poupa o envio inteiro de um arquivo
                  // que seria recusado — e explica qual exportação usar.
                  if (file.size > LINKEDIN_ZIP_MAX_MB * 1024 * 1024) {
                    toast(messages.tooLarge(LINKEDIN_ZIP_MAX_MB), "error");
                    return;
                  }
                  onImportArchive(file);
                }}
              />
            </label>

            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-soft px-3 py-1.5 text-xs text-text-subtle transition hover:text-text-strong">
              <FileUp className="h-3.5 w-3.5" />

              <>{messages.resumeButton}</>

              <input
                type="file"
                accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  // Mesmo teto do serviço (10 MB): o backend recusa com FILE_TOO_LARGE, mas
                  // avisar antes poupa o envio inteiro — e o DOC/DOCX avisa na hora que precisa
                  // sair em PDF (o accept acima já filtra, mas nem todo navegador respeita).
                  const name = file.name.toLowerCase();
                  if (/\.(doc|docx)$/.test(name)) {
                    toast(messages.resumeWrongFormat, "error");
                    return;
                  }
                  if (file.size > RESUME_MAX_MB * 1024 * 1024) {
                    toast(messages.resumeTooLarge, "error");
                    return;
                  }
                  onImportResume(file);
                }}
              />
            </label>
          </div>

          <p className="text-[11px] leading-relaxed text-text-subtle">{messages.resumeHint}</p>

          {pasteOpen && (
            <div className="space-y-2">
              <Textarea
                value={texto}
                onChange={(event) => setTexto(event.target.value)}
                placeholder={messages.pastePlaceholder}
                className="min-h-32 text-xs"
                maxLength={120_000}
              />

              <Button
                size="sm"
                className="rounded-full"
                disabled={!texto.trim() || textPending}
                onClick={() => onImportText(texto)}
              >
                {messages.pasteRead}
              </Button>
            </div>
          )}
        </div>
      )}

      {archivePending && <p className="text-xs text-text-subtle">{messages.loading}</p>}

      {resumePending && <p className="text-xs text-text-subtle">{messages.readingResume}</p>}

      {preview && (
        <div className="space-y-2">
          <p className="text-xs font-normal text-text-subtle">{messages.found(preview.found)}</p>

          {Object.keys(preview.semEstrutura ?? {}).length > 0 && (
            <p className="text-[11px] leading-relaxed text-text-subtle">
              {messages.semEstrutura(
                Object.entries(preview.semEstrutura)
                  .map(([rotulo, n]) => `${n} ${rotulo.toLowerCase()}`)
                  .join(", "),
              )}
            </p>
          )}

          <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg bg-surface-1 p-2">
            {linhas.map((linha) => (
              <label key={linha.key} className="flex items-center gap-2 text-xs text-text-strong">
                <input
                  type="checkbox"
                  checked={selected[linha.key] ?? false}
                  onChange={() => onToggle(linha.key)}
                />

                <span className="truncate">{linha.label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="rounded-full" disabled={savePending} onClick={onSave}>
              {messages.save}
            </Button>

            <Button size="sm" variant="ghost" className="rounded-full" onClick={onCancelPreview}>
              {messages.cancel}
            </Button>
          </div>
        </div>
      )}

      {contactsSection}
    </div>
  );
}
