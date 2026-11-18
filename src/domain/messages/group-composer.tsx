import { useState } from "react";

import { Check, Search } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { GroupComposerProps } from "../../types/domain/messages/group-composer-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";

/**
 * Criar grupo no chat: título e seleção MÚLTIPLA de pessoas (o relato: combinar uma jogatina
 * com um pessoal num chat único). Dados por props, intenção por callback — a aplicação é dona
 * da rede e da conversa criada. O botão só liga com título (3+ caracteres) e ao menos uma
 * pessoa marcada; um grupo sem nome ou sem gente não é um grupo.
 */
export function GroupComposer({
  contacts,
  onSearch,
  onCreate,
  pending = false,
}: GroupComposerProps) {
  const messages = useMessages().groupComposer;
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setPicked(next);
  };

  const valid = title.trim().length >= 3 && picked.size > 0;

  return (
    <div className="space-y-3">
      <Input
        aria-label={messages.name}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={messages.namePlaceholder}
        maxLength={80}
        className="h-9 rounded-full bg-muted"
      />

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          aria-label={messages.search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder={messages.search}
          className="h-9 rounded-full bg-muted pl-9"
        />
      </div>

      <div className="space-y-1">
        {contacts.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-subtle">{messages.noResults}</p>
        ) : (
          contacts.map((contact) => {
            const on = picked.has(contact.id);
            return (
              <button
                key={contact.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(contact.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition",
                  on ? "bg-primary-soft" : "hover:bg-surface-2",
                )}
              >
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-semibold text-text-strong">
                    {contact.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-text-strong">
                    {contact.name}
                  </span>

                  {contact.headline && (
                    <span className="block truncate text-xs font-normal text-text-subtle">
                      {contact.headline}
                    </span>
                  )}
                </span>
                {on && <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden />}
              </button>
            );
          })
        )}
      </div>

      <Button
        className="w-full rounded-full"
        disabled={!valid || pending}
        onClick={() => onCreate(title.trim(), [...picked])}
      >
        {messages.create(picked.size)}
      </Button>
    </div>
  );
}
