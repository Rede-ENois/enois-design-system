import { useState } from "react";

import { CheckCircle2, Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ContributionFormProps } from "../../types/domain/support/contribution-form-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Select } from "../../ui/select.js";
import { Textarea } from "../../ui/textarea.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formulário público de contribuição. A landing é aberta, então ele não pede conta: grava a
 * candidatura e o aceite dos termos para a fila interna de documentação do projeto.
 */
export function ContributionForm({
  termsHref,
  onSubmit,
  mode = "landing",
  initial,
}: ContributionFormProps) {
  const messages = useMessages().contributionForm;
  const verified = mode === "verified";
  const [name, setName] = useState(initial?.name ?? "");
  const [github, setGithub] = useState(initial?.github ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [area, setArea] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const reset = () => {
    setName("");
    setGithub("");
    setEmail("");
    setArea("");
    setExperience("");
    setMessage("");
    setAcceptedTerms(false);
    setErrors({});
    setFormError(null);
    setSent(false);
  };

  const submit = async () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = messages.validationName;
    if (!github.trim()) next.github = messages.validationGithub;
    if (!EMAIL_PATTERN.test(email.trim())) next.email = messages.validationEmail;
    if (!acceptedTerms) next.acceptedTerms = messages.validationTerms;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setFormError(null);
    setSending(true);
    try {
      const error = await onSubmit({
        name,
        github,
        email,
        area,
        experience,
        message,
        acceptedTerms,
      });
      if (error === null) setSent(true);
      else setFormError(error);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="py-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />

        <h3 className="mt-3 text-lg font-semibold tracking-tight">
          {verified ? messages.verifiedSuccessTitle : messages.successTitle}
        </h3>

        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {verified ? messages.verifiedSuccessDescription : messages.successDescription}
        </p>

        {!verified && (
          <Button variant="outline" className="mt-6 rounded-full" onClick={reset}>
            {messages.again}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contributor-name">{messages.fields.name}</Label>

          <Input
            id="contributor-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={messages.fields.namePlaceholder}
            maxLength={120}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contributor-github">{messages.fields.github}</Label>

          <Input
            id="contributor-github"
            value={github}
            onChange={(event) => setGithub(event.target.value)}
            placeholder={messages.fields.githubPlaceholder}
            maxLength={120}
            readOnly={verified}
            aria-readonly={verified}
          />
          {verified && <p className="text-xs text-text-subtle">{messages.verifiedGithubHint}</p>}
          {errors.github && <p className="text-xs text-destructive">{errors.github}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contributor-email">{messages.fields.email}</Label>

          <Input
            id="contributor-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={messages.fields.emailPlaceholder}
            maxLength={180}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contributor-area">{messages.fields.area}</Label>

          <Select
            id="contributor-area"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          >
            <option value="">{messages.fields.areaPlaceholder}</option>

            {messages.areas.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contributor-experience">{messages.fields.experience}</Label>

          <Select
            id="contributor-experience"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
          >
            <option value="">{messages.fields.experiencePlaceholder}</option>

            {messages.experiences.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contributor-message">{messages.fields.message}</Label>

        <Textarea
          id="contributor-message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={messages.fields.messagePlaceholder}
          maxLength={2000}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2 text-sm leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-input accent-primary"
        />

        <span>
          {messages.termsPrefix}

          <AppLink href={termsHref} className="text-primary hover:underline">
            {messages.termsLink}
          </AppLink>

          {messages.termsSuffix}
        </span>
      </label>
      {errors.acceptedTerms && <p className="text-xs text-destructive">{errors.acceptedTerms}</p>}

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
        ) : verified ? (
          messages.confirm
        ) : (
          messages.submit
        )}
      </Button>
    </div>
  );
}
