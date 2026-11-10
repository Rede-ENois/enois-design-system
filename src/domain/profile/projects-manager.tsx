import { useId, useRef, useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import { HtmlEditor } from "../../patterns/editor/html-editor.js";
import { TokenInput } from "../../patterns/token-input/token-input.js";
import type { EditingProject } from "../../types/domain/profile/editing-project.js";
import type { ProjectCardMode } from "../../types/domain/profile/project-card-mode.js";
import type { ProjectInput } from "../../types/domain/profile/project-input.js";
import type { ProjectsManagerProps } from "../../types/domain/profile/projects-manager-props.js";
import type { TokenInputHandle } from "../../types/patterns/token-input-handle.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

const STATUS_PRESETS = ["ideia", "em andamento", "pausado", "concluído"] as const;

const vazio = (): ProjectInput => ({
  title: "",
  description: "",
  banner: null,
  icon: null,
  stack: [],
  repoUrl: null,
  status: "em andamento",
  diary: [],
  html: null,
});

/**
 * Profile owner's project list and editor, with structured fields or a custom
 * HTML card that the backend sanitizes and an isolated frame renders.
 *
 * Confirmed technologies live in the project's stack array. TokenInput keeps
 * only the pending draft: Enter, comma input (including mobile and pasted lists)
 * and leaving the field commit trimmed values. Action buttons commit through
 * the input handle so a layout change cannot cancel their click. Saving includes
 * the remaining draft even without blur, with at most 10 technologies of 40
 * characters each. Case-insensitive duplicates show inline feedback.
 *
 * Chips wrap inside the field and have labelled removal buttons. Updating other
 * fields preserves the stack and the selected structured/HTML mode. The
 * Domain/Profile StackChips story demonstrates editing, saving and mobile wrapping.
 * Each editor instance owns unique field IDs, including its diary rows; status
 * choices are grouped under a legend and every input has an associated label.
 */
export function ProjectsManager({
  open,
  onOpenChange,
  projects,
  savePending = false,
  onSave,
  onDelete,
  renderHtmlFrame,
}: ProjectsManagerProps) {
  const messages = useMessages().projectsManager;
  const formId = useId();

  const [editando, setEditando] = useState<EditingProject>(null);
  const [modo, setModo] = useState<ProjectCardMode>("estruturado");
  const stackInputRef = useRef<TokenInputHandle>(null);

  const salvar = async () => {
    if (!editando) return;
    const stack = stackInputRef.current ? stackInputRef.current.commit() : editando.stack;
    if (!stack) return;
    const input: ProjectInput = {
      title: editando.title.trim(),
      description: editando.description?.trim() || null,
      banner: editando.banner?.trim() || null,
      icon: editando.icon?.trim() || null,
      stack,
      repoUrl: editando.repoUrl?.trim() || null,
      status: modo === "estruturado" ? editando.status?.trim() || null : null,
      diary: modo === "estruturado" ? editando.diary : [],
      html: modo === "html" ? editando.html?.trim() || null : null,
    };
    if (await onSave(editando.id, input)) setEditando(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.title}</DialogTitle>

          <DialogDescription>{messages.hint}</DialogDescription>
        </DialogHeader>

        {!editando && (
          <div className="space-y-3 pt-2">
            {projects.length === 0 && (
              <p className="py-4 text-center text-sm text-text-subtle">{messages.empty}</p>
            )}

            {projects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface-1 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-strong">{project.title}</p>

                  <p className="truncate text-xs text-text-subtle">
                    {[project.status, project.stack.slice(0, 3).join(", ")]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setModo(project.html ? "html" : "estruturado");
                      setEditando({
                        ...project,
                        html: project.html ?? null,
                        banner: project.banner ?? null,
                        icon: project.icon ?? null,
                      });
                    }}
                  >
                    {messages.edit}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full text-destructive"
                    onClick={() => {
                      if (confirm(messages.deleteConfirm)) onDelete(project.id);
                    }}
                  >
                    {messages.remove}
                  </Button>
                </div>
              </div>
            ))}

            <Button
              className="rounded-full gap-1.5"
              onClick={() => {
                setModo("estruturado");
                setEditando(vazio());
              }}
            >
              {messages.add}
            </Button>
          </div>
        )}

        {editando && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2">
              {(["estruturado", "html"] as ProjectCardMode[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={modo === option}
                  onClick={() => {
                    if (stackInputRef.current?.commit() === null) return;
                    setModo(option);
                  }}
                  className={
                    modo === option
                      ? "rounded-full border border-primary bg-primary-soft px-3 py-1.5 text-xs text-primary"
                      : "rounded-full border border-border-soft bg-surface-1 px-3 py-1.5 text-xs text-text-subtle hover:text-text-strong"
                  }
                >
                  {option === "estruturado" ? messages.modeStructured : messages.modeHtml}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`${formId}-title`} className="text-xs text-muted-foreground">
                {messages.titleField}
              </Label>

              <Input
                id={`${formId}-title`}
                value={editando.title}
                maxLength={120}
                onChange={(event) => setEditando({ ...editando, title: event.target.value })}
              />
            </div>

            {modo === "estruturado" ? (
              <>
                <div className="space-y-1.5">
                  <Label
                    htmlFor={`${formId}-description`}
                    className="text-xs text-muted-foreground"
                  >
                    {messages.descriptionField}
                  </Label>

                  <Input
                    id={`${formId}-description`}
                    value={editando.description ?? ""}
                    maxLength={500}
                    placeholder={messages.descriptionPlaceholder}
                    onChange={(event) =>
                      setEditando({ ...editando, description: event.target.value })
                    }
                  />
                </div>

                <fieldset className="space-y-1.5">
                  <legend className="text-xs font-medium leading-none text-muted-foreground">
                    {messages.statusField}
                  </legend>

                  <div className="flex flex-wrap gap-2">
                    {STATUS_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={editando.status === preset}
                        onClick={() => setEditando({ ...editando, status: preset })}
                        className={
                          editando.status === preset
                            ? "rounded-full border border-primary bg-primary-soft px-3 py-1 text-xs text-primary"
                            : "rounded-full border border-border-soft px-3 py-1 text-xs text-text-subtle hover:text-text-strong"
                        }
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <TokenInput
                  ref={stackInputRef}
                  id={`${formId}-stack`}
                  label={messages.stackField}
                  placeholder={messages.stackPlaceholder}
                  removeLabel={messages.stackRemove}
                  hint={messages.stackHint}
                  duplicateMessage={messages.stackDuplicate}
                  values={editando.stack}
                  max={10}
                  maxLength={40}
                  disabled={savePending}
                  onAdd={(token) =>
                    setEditando(
                      (project) => project && { ...project, stack: [...project.stack, token] },
                    )
                  }
                  onRemove={(token) =>
                    setEditando(
                      (project) =>
                        project && {
                          ...project,
                          stack: project.stack.filter((item) => item !== token),
                        },
                    )
                  }
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`${formId}-banner`} className="text-xs text-muted-foreground">
                      {messages.bannerField}
                    </Label>

                    <Input
                      id={`${formId}-banner`}
                      value={editando.banner ?? ""}
                      maxLength={500}
                      placeholder="https://…"
                      onChange={(event) => setEditando({ ...editando, banner: event.target.value })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`${formId}-icon`} className="text-xs text-muted-foreground">
                      {messages.iconField}
                    </Label>

                    <Input
                      id={`${formId}-icon`}
                      value={editando.icon ?? ""}
                      maxLength={500}
                      placeholder="https://…"
                      onChange={(event) => setEditando({ ...editando, icon: event.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`${formId}-repo`} className="text-xs text-muted-foreground">
                    {messages.repoField}
                  </Label>

                  <Input
                    id={`${formId}-repo`}
                    value={editando.repoUrl ?? ""}
                    maxLength={500}
                    placeholder="https://github.com/…"
                    onChange={(event) => setEditando({ ...editando, repoUrl: event.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium leading-none text-muted-foreground">
                      {messages.diary}
                    </h3>

                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() =>
                        setEditando({
                          ...editando,
                          diary: [
                            ...editando.diary,
                            { date: new Date().toISOString().slice(0, 10), text: "" },
                          ],
                        })
                      }
                    >
                      {messages.diaryAdd}
                    </Button>
                  </div>

                  {editando.diary.map((entry, index) => (
                    <div key={index} className="flex gap-2">
                      <Label htmlFor={`${formId}-diary-${index}-date`} className="sr-only">
                        {messages.diaryDate(index + 1)}
                      </Label>

                      <Input
                        id={`${formId}-diary-${index}-date`}
                        type="date"
                        value={entry.date}
                        className="w-36 shrink-0"
                        onChange={(event) => {
                          const diary = [...editando.diary];
                          diary[index] = { ...entry, date: event.target.value };
                          setEditando({ ...editando, diary });
                        }}
                      />

                      <Label htmlFor={`${formId}-diary-${index}-text`} className="sr-only">
                        {messages.diaryEntryText(index + 1)}
                      </Label>

                      <Textarea
                        id={`${formId}-diary-${index}-text`}
                        value={entry.text}
                        maxLength={400}
                        placeholder={messages.diaryText}
                        onChange={(event) => {
                          const diary = [...editando.diary];
                          diary[index] = { ...entry, text: event.target.value };
                          setEditando({ ...editando, diary });
                        }}
                      />

                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 text-destructive"
                        aria-label={messages.close}
                        onClick={() =>
                          setEditando({
                            ...editando,
                            diary: editando.diary.filter((_, i) => i !== index),
                          })
                        }
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <HtmlEditor
                  id={`${formId}-html`}
                  value={editando.html ?? ""}
                  onChange={(value) => setEditando({ ...editando, html: value })}
                  label={messages.modeHtml}
                  description={messages.htmlFrame}
                  placeholder="<h2>Meu projeto</h2>"
                  emptyPreview={messages.empty}
                  maxLength={20000}
                  // A prévia é uma janela do editor com altura de CARD (320px, rola por dentro) —
                  // com a moldura de celular padrão ela ficava com ~900px e empurrava o rodapé
                  // do diálogo para fora da tela.
                  previewClassName="mt-3 h-[320px] overflow-hidden rounded-xl border border-border-soft"
                  preview={renderHtmlFrame({
                    html: editando.html ?? "",
                    title: messages.htmlFrame,
                    className: "h-full",
                    // A prévia é uma janela do editor (área fixa): aqui a rolagem de dentro é o esperado.
                    autoHeight: false,
                  })}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-border-soft pt-3">
              <Button variant="ghost" className="rounded-full" onClick={() => setEditando(null)}>
                {messages.cancel}
              </Button>

              <Button className="rounded-full" disabled={savePending} onClick={() => void salvar()}>
                {messages.save}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
