import { useId, useState } from "react";

import { X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { HtmlEditor } from "../../patterns/editor/html-editor.js";
import type { EditingProject } from "../../types/domain/profile/editing-project.js";
import type { ProjectCardMode } from "../../types/domain/profile/project-card-mode.js";
import type { ProjectInput } from "../../types/domain/profile/project-input.js";
import type { ProjectsManagerProps } from "../../types/domain/profile/projects-manager-props.js";
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
  stack: [],
  repoUrl: null,
  status: "em andamento",
  diary: [],
  html: null,
});

/**
 * Gerenciador de projetos (dono do perfil): lista + editor, com a dualidade da
 * casa — preencher o formulário estruturado OU escrever o HTML do card (que o
 * backend sanitiza e o quadro isolado renderiza, como a bio e a capa).
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

  const [editando, setEditando] = useState<EditingProject>(null);
  const [modo, setModo] = useState<ProjectCardMode>("estruturado");
  const [stackTexto, setStackTexto] = useState("");
  const [stackError, setStackError] = useState(false);
  const stackInputId = useId();

  const addStackItems = (text: string) => {
    const stack = [...(editando?.stack ?? [])];
    const items = text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!items.length) {
      setStackTexto("");
      return stack;
    }

    let duplicate = false;
    for (const item of items) {
      if (stack.some((tech) => tech.trim().toLowerCase() === item.toLowerCase())) {
        duplicate = true;
      } else {
        stack.push(item);
      }
    }

    setEditando((current) => current && { ...current, stack });
    setStackTexto("");
    setStackError(duplicate);
    return stack;
  };

  const salvar = async () => {
    if (!editando) return;
    const input: ProjectInput = {
      title: editando.title.trim(),
      description: editando.description?.trim() || null,
      stack: addStackItems(stackTexto),
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
                      setStackTexto("");
                      setStackError(false);
                      setEditando({ ...project, html: project.html ?? null });
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
                setStackTexto("");
                setStackError(false);
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
                  onClick={() => setModo(option)}
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
              <Label className="text-xs text-muted-foreground">{messages.titleField}</Label>

              <Input
                value={editando.title}
                maxLength={120}
                onChange={(event) => setEditando({ ...editando, title: event.target.value })}
              />
            </div>

            {modo === "estruturado" ? (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    {messages.descriptionField}
                  </Label>

                  <Input
                    value={editando.description ?? ""}
                    maxLength={500}
                    placeholder={messages.descriptionPlaceholder}
                    onChange={(event) =>
                      setEditando({ ...editando, description: event.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{messages.statusField}</Label>

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
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={stackInputId} className="text-xs text-muted-foreground">
                    {messages.stackField}
                  </Label>

                  {editando.stack.length > 0 && (
                    <ul aria-label={messages.stackField} className="flex min-w-0 flex-wrap gap-1.5">
                      {editando.stack.map((tech, index) => (
                        <li
                          key={`${tech}-${index}`}
                          className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-full bg-primary-soft py-0.5 pl-2.5 pr-1 text-xs text-primary"
                        >
                          <span className="min-w-0 [overflow-wrap:anywhere]">{tech}</span>

                          <button
                            type="button"
                            aria-label={messages.stackRemove(tech)}
                            title={messages.stackRemove(tech)}
                            className="inline-flex size-6 shrink-0 items-center justify-center rounded-full hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            onClick={() => {
                              setEditando(
                                (current) =>
                                  current && {
                                    ...current,
                                    stack: current.stack.filter(
                                      (_, itemIndex) => itemIndex !== index,
                                    ),
                                  },
                              );
                              setStackError(false);
                            }}
                          >
                            <X className="size-3" aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Input
                    id={stackInputId}
                    value={stackTexto}
                    maxLength={400}
                    placeholder={messages.stackPlaceholder}
                    aria-invalid={stackError || undefined}
                    aria-describedby={`${stackInputId}-hint${stackError ? ` ${stackInputId}-error` : ""}`}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (
                        value.includes(",") &&
                        !(event.nativeEvent instanceof InputEvent && event.nativeEvent.isComposing)
                      ) {
                        addStackItems(value);
                      } else {
                        setStackTexto(value);
                        setStackError(false);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (
                        (event.key === "Enter" || event.key === ",") &&
                        !event.nativeEvent.isComposing
                      ) {
                        event.preventDefault();
                        addStackItems(event.currentTarget.value);
                      }
                    }}
                    onBlur={(event) => addStackItems(event.currentTarget.value)}
                  />

                  <p id={`${stackInputId}-hint`} className="text-xs text-text-subtle">
                    {messages.stackHint}
                  </p>

                  {stackError && (
                    <p
                      id={`${stackInputId}-error`}
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      {messages.stackDuplicate}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">{messages.repoField}</Label>

                  <Input
                    value={editando.repoUrl ?? ""}
                    maxLength={500}
                    placeholder="https://github.com/…"
                    onChange={(event) => setEditando({ ...editando, repoUrl: event.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">{messages.diary}</Label>

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
                      <Input
                        type="date"
                        value={entry.date}
                        className="w-36 shrink-0"
                        onChange={(event) => {
                          const diary = [...editando.diary];
                          diary[index] = { ...entry, date: event.target.value };
                          setEditando({ ...editando, diary });
                        }}
                      />
                      <Textarea
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
                <Label className="text-xs text-muted-foreground">{messages.modeHtml}</Label>

                <HtmlEditor
                  id="projeto-html"
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
