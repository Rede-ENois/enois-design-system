import { useState } from "react";

import { Dices, Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayDicePanelProps } from "../../types/domain/roleplay/roleplay-dice-panel-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { LoadingState } from "../../ui/loading-state.js";

import { FormField } from "./form-field.js";

/**
 * The dice panel: the server rolls and keeps the immutable ledger, so the view only sends the
 * expression and reports the ledger as it arrived.
 */
export function RoleplayDicePanel({
  rolls,
  loading = false,
  rolling = false,
  onRoll,
}: RoleplayDicePanelProps) {
  const messages = useMessages().roleplay;
  const [expression, setExpression] = useState("");
  const [label, setLabel] = useState("");

  const submit = () => {
    const trimmed = expression.trim();
    if (!trimmed) return;
    onRoll(trimmed, label.trim() || null);
    setExpression("");
    setLabel("");
  };

  return (
    <div className="space-y-4">
      <section className="surface-card min-w-0 space-y-4 p-4">
        <FormField label={messages.diceExpressionLabel}>
          {(control) => (
            <Input
              {...control}
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              placeholder={messages.diceExpressionPlaceholder}
              showCounter={false}
            />
          )}
        </FormField>

        <FormField label={messages.diceLabelLabel}>
          {(control) => (
            <Input
              {...control}
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder={messages.diceLabelPlaceholder}
              maxLength={120}
              showCounter={false}
            />
          )}
        </FormField>

        <Button
          className="w-auto rounded-full"
          disabled={!expression.trim() || rolling}
          onClick={submit}
        >
          {rolling ? <Loader2 className="animate-spin" aria-hidden /> : <Dices aria-hidden />}
          {rolling ? messages.rolling : messages.roll}
        </Button>
      </section>

      <section className="min-w-0 space-y-2">
        <h3 className="text-sm font-semibold text-text-strong">{messages.diceHistory}</h3>

        {loading && <LoadingState label={messages.loading} />}

        {!loading && rolls.length === 0 && (
          <p className="text-sm text-text-subtle">{messages.diceEmpty}</p>
        )}

        <ul className="space-y-2">
          {rolls.map((roll) => (
            <li key={roll.id}>
              <RollRow roll={roll} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RollRow({
  roll,
}: {
  roll: { expression: string; dice: number[]; total: number; label: string | null };
}) {
  const messages = useMessages().roleplay;

  return (
    <div className="surface-card flex flex-wrap items-center gap-2 px-3 py-2 text-sm">
      <Dices aria-hidden className="h-4 w-4 shrink-0 text-primary" />

      <span className="font-mono text-text-strong">{roll.expression}</span>

      <span className="text-text-subtle">
        [{roll.dice.join(", ")}]{roll.dice.length > 1 ? ` · ${messages.diceTotal}` : ""}
      </span>

      <span className="ml-auto min-w-0 break-words font-semibold text-text-strong">
        {roll.total}
        {roll.label ? ` · ${roll.label}` : ""}
      </span>
    </div>
  );
}
