import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { EventCardData } from "../../types/domain/events/event-card-data.js";
import type { EventRecurrence } from "../../types/domain/events/event-recurrence.js";

import { EventCard } from "./event-card.js";
import { EventRecurrenceControl } from "./event-recurrence-control.js";
import { EventRecurrenceField } from "./event-recurrence-field.js";
import { EventRitualsFilter } from "./event-rituals-filter.js";

const meta: Meta = {
  title: "Domain/Events",
};

export default meta;

const ritual: EventCardData = {
  id: "e1",
  title: "Show and tell",
  date: "2026-11-06",
  format: "ONLINE",
  host: "Comunidade Énóis",
  attendees: 18,
  cover: null,
  streamUrl: "https://example.com/live",
  location: null,
  expired: false,
  attending: false,
  recurrence: "WEEKLY",
  nextOccurrenceDate: "2026-11-13",
};

const cardProps = {
  dateTimeLabel: "6 nov · 19:00",
  attendancePending: false,
  onAttend: () => {},
  onCancelAttend: () => {},
};

export const Cards: StoryObj = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <EventCard {...cardProps} event={ritual} />
      <EventCard
        {...cardProps}
        event={{
          ...ritual,
          id: "e2",
          title: "Game jam do mês",
          format: "HYBRID",
          location: "Rua dos Exemplos, 100, Belo Horizonte",
          attending: true,
          recurrence: "MONTHLY",
          nextOccurrenceDate: null,
        }}
      />
      <EventCard
        {...cardProps}
        event={{
          ...ritual,
          id: "e3",
          title: "Meetup de lançamento",
          recurrence: "NONE",
          expired: true,
        }}
      />
    </div>
  ),
};

export const Highlighted: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <EventCard
        {...cardProps}
        highlighted
        event={{ ...ritual, title: "Revisão de código ao vivo", recurrence: "BIWEEKLY" }}
      />
    </div>
  ),
};

export const RecurrenceField: StoryObj = {
  render: function RecurrenceFieldStory() {
    const [value, setValue] = useState<EventRecurrence>("NONE");
    return (
      <div className="max-w-sm">
        <EventRecurrenceField value={value} onChange={setValue} />
      </div>
    );
  },
};

export const RecurrenceFieldError: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <EventRecurrenceField
        value="WEEKLY"
        onChange={() => {}}
        error="Defina um horário para o evento se repetir."
      />
    </div>
  ),
};

export const RecurrenceControl: StoryObj = {
  render: function RecurrenceControlStory() {
    const [value, setValue] = useState<EventRecurrence>("WEEKLY");
    return (
      <div className="max-w-sm">
        <EventRecurrenceControl value={value} onChange={setValue} pending={false} />
      </div>
    );
  },
};

export const RecurrenceControlSaving: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <EventRecurrenceControl value="WEEKLY" onChange={() => {}} pending />
    </div>
  ),
};

export const RecurrenceControlError: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <EventRecurrenceControl
        value="BIWEEKLY"
        onChange={() => {}}
        pending={false}
        error="Não foi possível atualizar a série. Tente de novo."
      />
    </div>
  ),
};

export const RitualsFilter: StoryObj = {
  render: function RitualsFilterStory() {
    const [value, setValue] = useState(false);
    return <EventRitualsFilter value={value} onChange={setValue} />;
  },
};
