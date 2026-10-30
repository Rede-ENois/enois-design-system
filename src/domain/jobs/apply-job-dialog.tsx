import { useRef, useState } from "react";

import { CheckCircle2, FileUp, Loader2, Send } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ApplyJobDialogProps } from "../../types/domain/jobs/apply-job-dialog-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

import { ProfessionalSignature } from "./professional-signature.js";

/**
 * Candidatura: responde o formulário que o autor montou e envia o perfil.
 *
 * Sai SEMPRE pela identidade profissional (a linha "você envia como" diz qual; sem perfil ativo, o
 * diálogo leva a ativar). A tela mostra o que vai junto (perfil, experiências, reputação) porque a candidatura entrega esses
 * dados ao empregador — e erros do backend aparecem com o motivo real (já candidatado, campo
 * obrigatório, conta não verificada), em vez de "erro inesperado".
 */
export function ApplyJobDialog({
  job,
  children,
  onOpenChange,
  pending,
  done,
  error,
  verifyHref,
  applicant = null,
  professionalSetupHref = null,
  onSubmit,
  onPrefill,
}: ApplyJobDialogProps) {
  const messages = useMessages().applyJobDialog;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  // Campos que o currículo não soube responder: ficam vazios com destaque "preencha aqui".
  const [unfilled, setUnfilled] = useState<Record<string, string>>({});
  const [prefilling, setPrefilling] = useState(false);
  const [prefillError, setPrefillError] = useState<string | null>(null);
  const [prefillSummary, setPrefillSummary] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fields = job.applicationFields ?? [];
  const missingRequired = fields.filter(
    (field) => field.required && !(values[field.id] ?? "").trim(),
  );

  // Preenche a inscrição com o currículo: o app sobe o arquivo + o id da vaga e devolve mensagem e
  // respostas sugeridas. Só sugere — a pessoa revisa e envia pelo fluxo existente.
  const handlePrefillFile = async (file: File | undefined) => {
    if (!file) return;
    setPrefillError(null);
    setPrefillSummary(null);
    setPrefilling(true);
    try {
      const result = await onPrefill(file);
      setPrefillError(null);
      if (result.suggestedMessage) setMessage(result.suggestedMessage);
      setValues((current) => {
        const next = { ...current };
        for (const field of result.fields) {
          if (field.suggestedValue) next[field.fieldId] = field.suggestedValue;
        }
        return next;
      });
      setUnfilled((current) => {
        const next = { ...current };
        for (const field of result.fields) {
          if (!field.suggestedValue && field.reason) next[field.fieldId] = field.reason;
          else delete next[field.fieldId];
        }
        return next;
      });
      setPrefillSummary(messages.resumeFilled(result.filled, result.total));
    } catch (err) {
      setPrefillError(err instanceof Error ? err.message : String(err));
    } finally {
      setPrefilling(false);
    }
  };

  const close = (next: boolean) => {
    setOpen(next);
    if (!next && done) {
      setMessage("");
      setValues({});
      setUnfilled({});
      setPrefillError(null);
      setPrefillSummary(null);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.title(job.title)}</DialogTitle>

          <DialogDescription>{messages.intro}</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-growth" />

            <p className="mt-3 text-base font-medium">{messages.success}</p>

            <p className="mt-2 text-sm text-muted-foreground">{messages.successDescription}</p>

            <Button className="mt-5 w-full rounded-full" onClick={() => close(false)}>
              {messages.close}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <ProfessionalSignature identity={applicant} setupHref={professionalSetupHref} />

            <div className="rounded-xl bg-muted/60 px-4 py-3">
              <p className="text-sm font-medium">{messages.aboutYou}</p>

              <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                <li>· {messages.aboutYouProfile}</li>

                <li>· {messages.aboutYouExperience}</li>

                <li>· {messages.aboutYouReputation}</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  void handlePrefillFile(file);
                }}
              />

              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full gap-1.5"
                disabled={prefilling}
                onClick={() => fileRef.current?.click()}
              >
                {prefilling ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileUp className="h-4 w-4" />
                )}

                <>{prefilling ? messages.resumeReading : messages.resumePrefill}</>
              </Button>

              <p className="text-xs text-muted-foreground">{messages.resumePrefillHint}</p>

              {prefillSummary && !prefillError && (
                <p className="text-xs text-growth">{prefillSummary}</p>
              )}

              {prefillError && (
                <p className="rounded-xl bg-destructive/10 px-4 py-2 text-xs text-destructive">
                  {prefillError}
                </p>
              )}
            </div>

            {fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <Label className="text-xs">
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </Label>

                {unfilled[field.id] && !(values[field.id] ?? "").trim() && (
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                    {messages.resumeNoSuggestion}
                    {messages.resumeMissingField}
                  </p>
                )}

                {field.type === "TEXTAREA" ? (
                  <Textarea
                    rows={3}
                    value={values[field.id] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.id]: event.target.value }))
                    }
                    placeholder={unfilled[field.id] ? messages.resumeNoSuggestion : undefined}
                  />
                ) : (
                  <Input
                    value={values[field.id] ?? ""}
                    onChange={(event) =>
                      setValues((current) => ({ ...current, [field.id]: event.target.value }))
                    }
                    type={field.type === "NUMBER" ? "number" : "text"}
                    inputMode={field.type === "NUMBER" ? "numeric" : undefined}
                    placeholder={
                      unfilled[field.id]
                        ? messages.resumeNoSuggestion
                        : field.type === "LINK"
                          ? "https://"
                          : field.type === "NUMBER"
                            ? "0"
                            : ""
                    }
                  />
                )}
              </div>
            ))}

            {fields.some((field) => field.required) && (
              <p className="text-xs text-muted-foreground">{messages.requiredHint}</p>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs">{messages.message}</Label>

              <Textarea
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={messages.messagePlaceholder}
                maxLength={2000}
              />
            </div>

            {error && (
              <div className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
                <p>{error}</p>

                {verifyHref && (
                  <AppLink
                    href={verifyHref}
                    className="mt-1 inline-block text-xs font-medium underline"
                  >
                    {messages.verifyIdentity}
                  </AppLink>
                )}
              </div>
            )}

            <Button
              className="w-full rounded-full gap-2"
              disabled={pending || missingRequired.length > 0 || Boolean(professionalSetupHref)}
              onClick={() => onSubmit({ message, values })}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              <>{pending ? messages.sending : messages.send}</>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
