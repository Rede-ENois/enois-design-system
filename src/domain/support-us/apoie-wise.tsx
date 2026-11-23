import { useState } from "react";

import { textFieldClasses } from "../../lib/text-field-classes.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ApoieWiseProps } from "../../types/components/domain/support-us/apoie-wise-props.js";
import { Button } from "../../ui/button.js";
import { Pill } from "../../ui/pill.js";

/**
 * The dollar donation through Wise: people outside Brazil, or paying by card, open the project's
 * payment page and fill the amount there. The view does not build the payment — it only links to
 * the `href` the app passes, in a new tab.
 */
const VALORES_SUGERIDOS = ["5", "10", "25", "50"] as const;

export function ApoieWise({ href }: ApoieWiseProps) {
  const messages = useMessages().apoieWise;
  const [dolares, setDolares] = useState<string>(VALORES_SUGERIDOS[1]);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border-soft bg-surface-card p-4 sm:p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-medium text-text-strong">{messages.title}</h2>

        <p className="text-sm text-text-subtle">{messages.description}</p>
      </div>

      <p className="sr-only">{messages.suggestedValues}</p>

      <div className="flex flex-wrap gap-1.5">
        {VALORES_SUGERIDOS.map((valor) => (
          <Pill
            key={valor}
            size="sm"
            active={dolares === valor}
            onClick={() => setDolares(valor)}
            className="shrink-0"
          >
            {messages.suggestedValue(valor)}
          </Pill>
        ))}
      </div>

      <label className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
        <span className="shrink-0 text-xs text-text-subtle">{messages.otherValue}</span>

        <input
          type="number"
          inputMode="decimal"
          min={1}
          step="1"
          value={dolares}
          onChange={(event) => setDolares(event.target.value)}
          className={textFieldClasses(
            "w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm text-text-strong shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-28",
          )}
        />
      </label>

      <Button asChild variant="outline" className="w-full gap-2 rounded-full sm:w-fit">
        <a href={href} target="_blank" rel="noopener noreferrer">
          {messages.open}
        </a>
      </Button>

      <p className="text-xs text-text-subtle">{messages.feeNote}</p>

      <p className="text-xs text-text-subtle">{messages.noSeal}</p>
    </div>
  );
}
