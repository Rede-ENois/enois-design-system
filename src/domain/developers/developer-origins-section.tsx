import { useState } from "react";

import { Globe, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { DeveloperOriginsSectionProps } from "../../types/domain/developers/developer-origins-section-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";

/**
 * Cadastro da origem que pode consumir a API pública pelo navegador. Sem ela, o preflight de
 * /v1 responde 403 e o CORS não libera a leitura da resposta.
 */
export function DeveloperOriginsSection({
  authenticated,
  loginHref,
  loading,
  origins,
  addPending = false,
  onAdd,
  removePending = false,
  onRemove,
}: DeveloperOriginsSectionProps) {
  const messages = useMessages().developerOriginsSection;
  const [origin, setOrigin] = useState("");

  if (!authenticated) {
    return (
      <p className="mt-2 text-sm text-text-subtle">
        {messages.login}{" "}
        <AppLink href={loginHref} className="text-primary hover:underline">
          {messages.enter}
        </AppLink>
      </p>
    );
  }

  return (
    <div className="mt-3 space-y-3">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          if (origin.trim())
            void onAdd(origin).then((saved) => {
              if (saved) setOrigin("");
            });
        }}
      >
        <Input
          value={origin}
          onChange={(event) => setOrigin(event.target.value)}
          placeholder={messages.placeholder}
          inputMode="url"
          aria-label={messages.placeholder}
        />

        <Button
          type="submit"
          className="w-auto shrink-0 rounded-full"
          disabled={!origin.trim() || addPending}
        >
          {messages.add}
        </Button>
      </form>

      <p className="text-xs text-text-subtle">{messages.validHint}</p>

      {loading ? null : origins.length === 0 ? (
        <p className="text-sm text-text-subtle">{messages.empty}</p>
      ) : (
        <ul className="space-y-1.5">
          {origins.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border-soft bg-surface-1 px-3 py-2 text-sm"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <Globe
                  className={
                    item.blocked
                      ? "h-4 w-4 shrink-0 text-destructive"
                      : "h-4 w-4 shrink-0 text-primary"
                  }
                />

                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-text-strong">{item.origin}</span>

                  {item.blocked && (
                    <span className="truncate text-xs text-destructive">
                      {messages.blocked}
                      {item.blockedReason ? ` · ${item.blockedReason}` : ""}
                    </span>
                  )}
                </span>
              </span>

              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={removePending}
                title={messages.remove}
                aria-label={messages.remove}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-text-subtle transition hover:bg-surface-2 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
