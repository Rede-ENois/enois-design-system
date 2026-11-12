import { useRef, useState } from "react";

import { CheckCircle2, Loader2, Paperclip, X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { SupportFormProps } from "../../types/domain/support/support-form-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Select } from "../../ui/select.js";
import { Textarea } from "../../ui/textarea.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE = 10;

/**
 * Formulario de pedido de ajuda (atendimento humano). Fica num componente porque aparece em dois
 * lugares: a pagina /suporte (dentro do app) e a /contato (alcancavel sem login).
 */
export function SupportForm({ defaultContactEmail, onUploadImage, onSubmit }: SupportFormProps) {
  const messages = useMessages().supportForm;
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contactEmail, setContactEmail] = useState(defaultContactEmail ?? "");
  const [category, setCategory] = useState("OTHER");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setSubject("");
    setMessage("");
    setErrors({});
    setFormError(null);
    setSent(false);
    setImageUrl(null);
  };

  const attachImage = async (file: File) => {
    setUploading(true);
    try {
      const uploaded = await onUploadImage(file);
      if (uploaded === null) setFormError(messages.imageUploadError);
      else setImageUrl(uploaded);
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    const next: Record<string, string> = {};
    if (!subject.trim()) next.subject = messages.validationSubject;
    if (message.trim().length < MIN_MESSAGE) next.message = messages.validationMessage;
    if (!EMAIL_PATTERN.test(contactEmail.trim())) next.contactEmail = messages.validationEmail;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setFormError(null);
    setSending(true);
    try {
      const error = await onSubmit({ subject, message, contactEmail, category, imageUrl });
      if (error === null) setSent(true);
      else setFormError(error);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="py-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />

        <h2 className="mt-3 text-lg font-semibold tracking-tight">{messages.successTitle}</h2>

        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {messages.successDescription}
        </p>

        <Button variant="outline" className="mt-6 rounded-full" onClick={reset}>
          {messages.newRequest}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="support-subject">{messages.subject}</Label>

        <Input
          id="support-subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder={messages.subjectPlaceholder}
          maxLength={160}
        />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="support-category">{messages.category}</Label>

        <Select
          id="support-category"
          value={category}
          onChange={(event) => {
            const value = event.target.value;
            setCategory(value);
            // Pedido de API: o texto ja vem com os campos que o time precisa conferir.
            if (value === "API_ACCESS" && !message.trim()) {
              setMessage(messages.apiAccessTemplate);
            }
          }}
        >
          {messages.categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <p className="text-xs text-muted-foreground">{messages.categoryHint}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="support-message">{messages.message}</Label>

        <Textarea
          id="support-message"
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={messages.messagePlaceholder}
          maxLength={4000}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>

      {/* Anexo de imagem: o print que explica o pedido — chega como anexo no e-mail do time. */}
      <div className="space-y-1.5">
        <Label htmlFor="support-image" className="flex items-center gap-1.5">
          <Paperclip className="h-3.5 w-3.5" />

          <>{messages.attachImage}</>
        </Label>

        <input
          ref={fileRef}
          id="support-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void attachImage(file);
            event.target.value = "";
          }}
        />

        {imageUrl ? (
          <div className="relative inline-block">
            <img
              src={imageUrl}
              alt=""
              className="h-24 w-auto rounded-lg border border-border-soft object-cover"
            />

            <button
              type="button"
              aria-label={messages.removeImage}
              title={messages.removeImage}
              onClick={() => setImageUrl(null)}
              className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-surface-card text-muted-foreground shadow-md transition hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}

            <>{uploading ? messages.uploading : messages.attachImageAction}</>
          </Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="support-email">{messages.contactEmail}</Label>

        <Input
          id="support-email"
          type="email"
          value={contactEmail}
          onChange={(event) => setContactEmail(event.target.value)}
          maxLength={255}
        />

        <p className="text-xs text-text-subtle">{messages.contactEmailHint}</p>
        {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail}</p>}
      </div>

      {formError && (
        <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {formError}
        </p>
      )}

      <Button className="w-full rounded-full" disabled={sending} onClick={submit}>
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />

            <>{messages.sending}</>
          </>
        ) : (
          messages.action
        )}
      </Button>
    </div>
  );
}
