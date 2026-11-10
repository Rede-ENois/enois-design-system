import { type KeyboardEvent, useEffect, useRef, useState } from "react";

import { AtSign, Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { UserPickerProps } from "../../types/domain/search/user-picker-props.js";
import { UserAvatar } from "../avatar/user-avatar.js";

/**
 * Campo de destinatário com busca de usuário (igual ao marcar @): a pessoa digita nome
 * ou @username, a busca roda com debounce e o clique preenche a CHAVE (o username) —
 * o mesmo identificador que a transferência da faísca fala.
 */
export function UserPicker({
  value,
  onChange,
  placeholder,
  options: resultados,
  isFetching,
  onQueryChange,
}: UserPickerProps) {
  const messages = useMessages().userPicker;
  const [query, setQuery] = useState("");
  const [aberto, setAberto] = useState(false);
  const [destaque, setDestaque] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onQueryChange(query);
  }, [query, onQueryChange]);

  // fecha ao clicar fora
  useEffect(() => {
    const fora = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", fora);
    return () => document.removeEventListener("mousedown", fora);
  }, []);

  const seleciona = (username: string) => {
    onChange(username);
    setAberto(false);
    setQuery("");
    input.current?.blur();
  };

  const teclas = (e: KeyboardEvent) => {
    if (!aberto || resultados.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDestaque((d) => (d + 1) % resultados.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setDestaque((d) => (d - 1 + resultados.length) % resultados.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      seleciona(resultados[destaque].username);
    } else if (e.key === "Escape") {
      setAberto(false);
    }
  };

  return (
    <div ref={raiz} className="relative">
      <div className="relative">
        <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
        <input
          ref={input}
          value={aberto ? query : value}
          onChange={(e) => {
            setQuery(e.target.value);
            setAberto(true);
            setDestaque(0);
          }}
          onFocus={() => {
            setQuery(value);
            setAberto(true);
          }}
          onKeyDown={teclas}
          placeholder={placeholder ?? messages.placeholder}
          className="h-10 w-full rounded-lg border border-border-soft bg-transparent pl-9 pr-9 text-base md:text-sm text-text-strong outline-none transition focus-visible:border-primary"
          autoComplete="off"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-text-subtle" />
        )}
      </div>

      {aberto && query.trim().length >= 2 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border-soft bg-surface-card p-1 shadow-lg">
          {resultados.length === 0 && !isFetching && (
            <li className="px-3 py-2 text-sm text-text-subtle">{messages.empty}</li>
          )}
          {resultados.map((u, i) => (
            <li key={u.username}>
              <button
                type="button"
                className={`flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition ${i === destaque ? "bg-surface-2" : "hover:bg-surface-2"}`}
                onClick={() => seleciona(u.username)}
              >
                <UserAvatar src={u.avatar} alt={u.name} className="h-8 w-8 shrink-0" />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-text-strong">
                    {u.name}
                  </span>

                  <span className="block truncate text-xs text-text-subtle">@{u.username}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
