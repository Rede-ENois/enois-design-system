import { useEffect, useRef, useState } from "react";

import { Loader2, Search } from "lucide-react";
import { createPortal } from "react-dom";

import { useMessages } from "../../messages/messages-context.js";
import type { GlobalSearchProps } from "../../types/domain/search/global-search-props.js";
import type { GlobalSearchResultData } from "../../types/domain/search/global-search-result-data.js";
import { Input } from "../../ui/input.js";

import { GlobalSearchResults } from "./global-search-results.js";

export function GlobalSearch({ results, isFetching, onQueryChange, onSelect }: GlobalSearchProps) {
  const messages = useMessages().globalSearch;
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    onQueryChange(debounced);
  }, [debounced, onQueryChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fieldRef.current && !fieldRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileOpen) inputRef.current?.focus();
  }, [mobileOpen]);

  // Fecha a busca mobile ao scrollar pra baixo.
  useEffect(() => {
    if (!mobileOpen) return;
    const onScroll = () => {
      setMobileOpen(false);
      setOpen(false);
      setQuery("");
    };
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

  const closeSearch = () => {
    setOpen(false);
    setQuery("");
  };

  const handleSelect = (item: GlobalSearchResultData) => {
    closeSearch();
    setMobileOpen(false);
    onSelect(item);
  };

  const resultsNode = (positioned: boolean) => (
    <div
      className={
        positioned
          ? "absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-border-soft bg-surface-card shadow-card"
          : "overflow-hidden rounded-2xl border border-border-soft bg-surface-card shadow-card"
      }
    >
      <GlobalSearchResults
        items={results}
        query={debounced}
        isFetching={isFetching}
        onSelect={handleSelect}
      />
    </div>
  );

  return (
    <>
      <button
        onClick={() => {
          setMobileOpen(true);
          setOpen(true);
        }}
        className="relative z-20 ml-auto grid h-10 w-10 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-primary md:hidden"
        aria-label={messages.action}
        title={messages.action}
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Campo do cabeçalho no desktop. */}
      <div ref={fieldRef} className="relative ml-2 hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-subtle" />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={messages.placeholder}
          className="h-10 rounded-full border-border-soft bg-surface-1 pl-9"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-text-subtle" />
        )}
        {open && debounced.length >= 2 && resultsNode(true)}
      </div>

      {/*
        Overlay da busca mobile, montado em <body> por portal: o cabeçalho usa `backdrop-blur-md`,
        e um ancestral com filtro vira o bloco de contenção de descendentes `position: fixed` —
        o overlay ficaria preso aos 56px do cabeçalho em vez de cobrir a tela.
      */}
      {mobileOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 pt-4 backdrop-blur-sm md:hidden"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setMobileOpen(false);
                closeSearch();
              }
            }}
          >
            <div className="relative w-full max-w-md px-4">
              <Search className="pointer-events-none absolute left-7 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-subtle" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder={messages.placeholder}
                className="h-12 rounded-full border-border-soft bg-surface-card pl-10 pr-4 focus-visible:border-primary"
              />
              {isFetching && (
                <Loader2 className="absolute right-7 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-text-subtle" />
              )}
              {open && debounced.length >= 2 && (
                <div className="absolute left-4 right-4 top-full mt-2">{resultsNode(false)}</div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
