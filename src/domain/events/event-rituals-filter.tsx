import { useMessages } from "../../messages/messages-context.js";
import type { EventRitualsFilterProps } from "../../types/domain/events/event-rituals-filter-props.js";
import { PillRow } from "../../ui/pill-row.js";
import { Pill } from "../../ui/pill.js";

/** "Todos" / "Rituais" switch above the events list. */
export function EventRitualsFilter({ value, onChange }: EventRitualsFilterProps) {
  const messages = useMessages().eventRecurrence;

  return (
    <PillRow label={messages.filterLabel}>
      <Pill size="sm" active={!value} onClick={() => onChange(false)}>
        {messages.filterAll}
      </Pill>

      <Pill size="sm" active={value} onClick={() => onChange(true)}>
        {messages.filterRituals}
      </Pill>
    </PillRow>
  );
}
