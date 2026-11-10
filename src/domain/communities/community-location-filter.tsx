import { useEffect, useState } from "react";

import { ChevronDown, MapPin } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import { CityStateField } from "../../patterns/location/city-state-field.js";
import type { CommunityLocationFilterProps } from "../../types/domain/communities/community-location-filter-props.js";
import { Button } from "../../ui/button.js";

/** UF + city filter for the communities list. A state alone filters the whole UF. */
export function CommunityLocationFilter({ value, onApply, onClear }: CommunityLocationFilterProps) {
  const messages = useMessages().communityLocationFilter;
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);

  // The applied filter can change outside (URL, clear elsewhere): the draft follows it.
  useEffect(() => {
    setDraft({ city: value.city, state: value.state });
    setError(null);
  }, [value.city, value.state]);

  const active = Boolean(value.city || value.state);
  // No celular o formulário inteiro (cidade, estado, dica e botão) ocupava a primeira tela antes de
  // aparecer uma comunidade. Recolhido, vira uma linha que mostra o filtro aplicado; com filtro
  // ativo já abre aberto, para a pessoa ver e poder limpar. Do `sm` para cima segue sempre à vista.
  const [expanded, setExpanded] = useState(active);
  const appliedLabel = [value.city, value.state].filter(Boolean).join(", ");

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
        className="flex min-h-10 w-full items-center gap-2 rounded-full border border-border-soft px-3 text-sm font-medium text-text-subtle transition hover:bg-surface-2 hover:text-text-strong sm:hidden"
      >
        <MapPin className="h-4 w-4 shrink-0" aria-hidden />

        <span className="min-w-0 truncate">{appliedLabel || messages.label}</span>

        <ChevronDown
          className={cn("ml-auto h-4 w-4 shrink-0 transition-transform", expanded && "rotate-180")}
          aria-hidden
        />
      </button>

      <form
        role="search"
        aria-label={messages.label}
        className={cn("flex-col gap-3", expanded ? "flex" : "hidden sm:flex")}
        onSubmit={(event) => {
          event.preventDefault();
          const city = draft.city.trim();
          if (city && !draft.state) {
            setError(messages.cityNeedsState);
            return;
          }
          setError(null);
          onApply({ city, state: draft.state });
          setExpanded(false);
        }}
      >
        <CityStateField
          idPrefix="community-location-filter"
          legend={messages.label}
          hint={messages.hint}
          value={draft}
          error={error}
          onChange={(next) => {
            setDraft(next);
            setError(null);
          }}
        />

        <div className="flex gap-2">
          <Button type="submit" size="sm" className="rounded-full">
            {messages.apply}
          </Button>

          {active && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() => {
                onClear();
                setExpanded(false);
              }}
            >
              {messages.clear}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
