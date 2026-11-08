import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import { Button } from "../../ui/button.js";

import { CalendarAgenda } from "./calendar-agenda.js";
import { CalendarEntryFormDialog } from "./calendar-entry-form-dialog.js";

const meta: Meta = {
  title: "Domain/Calendar",
  decorators: [(Story) => <div className="w-full p-4">{Story()}</div>],
};

export default meta;

const TODAY = "2026-11-08";
const ZONE = "America/Sao_Paulo";

const agenda: CalendarAgendaItemData[] = [
  {
    entry: {
      id: "cal_meeting",
      scope: "PROFESSIONAL",
      kind: "MEETING",
      title: "Revisão do trimestre",
      description: null,
      startsAt: "2026-11-10T13:00:00Z",
      endsAt: "2026-11-10T14:00:00Z",
      timeZoneId: ZONE,
      allDay: false,
      cancelledAt: null,
    },
    owner: true,
    participation: null,
  },
  {
    entry: {
      id: "cal_dinner",
      scope: "SOCIAL",
      kind: "EVENT",
      title: "Jantar da turma",
      description: null,
      startsAt: "2026-11-10T22:00:00Z",
      endsAt: "2026-11-10T23:30:00Z",
      timeZoneId: ZONE,
      allDay: false,
      cancelledAt: null,
    },
    owner: false,
    participation: "INVITED",
  },
  {
    entry: {
      id: "cal_mentoring",
      scope: "PROFESSIONAL",
      kind: "MENTORING",
      title: "Mentoria de portfólio com Ana",
      description: null,
      startsAt: "2026-11-12T18:00:00Z",
      endsAt: "2026-11-12T19:00:00Z",
      timeZoneId: ZONE,
      allDay: false,
      cancelledAt: null,
    },
    owner: false,
    participation: "ACCEPTED",
  },
  {
    entry: {
      id: "cal_holiday",
      scope: "SOCIAL",
      kind: "PERSONAL",
      title: "Aniversário da Bia",
      description: null,
      startsAt: "2026-11-15T03:00:00Z",
      endsAt: "2026-11-15T21:00:00Z",
      timeZoneId: ZONE,
      allDay: true,
      cancelledAt: null,
    },
    owner: true,
    participation: null,
  },
  {
    entry: {
      id: "cal_cancelled",
      scope: "SOCIAL",
      kind: "EVENT",
      title: "Festa que virou outra data",
      description: null,
      startsAt: "2026-11-20T22:00:00Z",
      endsAt: "2026-11-20T23:00:00Z",
      timeZoneId: ZONE,
      allDay: false,
      cancelledAt: "2026-11-09T00:00:00Z",
    },
    owner: true,
    participation: null,
  },
];

const base = {
  period: "2026-11",
  onPeriodChange: () => {},
  items: agenda,
  timeZoneId: ZONE,
  today: TODAY,
  onViewChange: () => {},
  onSelectDay: () => {},
  onSelectItem: () => {},
  itemHref: (id: string) => `#${id}`,
};

export const Month: StoryObj = {
  render: () => <CalendarAgenda {...base} view="month" selectedDay="2026-11-10" />,
};

export const Week: StoryObj = {
  render: () => <CalendarAgenda {...base} view="week" period="2026-11-08" />,
};

export const Day: StoryObj = {
  render: () => (
    <CalendarAgenda
      {...base}
      view="day"
      period="2026-11-10"
      onRespond={() => {}}
      eyebrow="Social e profissional"
    />
  ),
};

export const DayAnswering: StoryObj = {
  render: () => (
    <CalendarAgenda
      {...base}
      view="day"
      period="2026-11-10"
      onRespond={() => {}}
      respondingId="cal_dinner"
    />
  ),
};

export const DayAnswerFailed: StoryObj = {
  render: () => (
    <CalendarAgenda {...base} view="day" period="2026-11-10" onRespond={() => {}} respondError />
  ),
};

export const List: StoryObj = {
  render: () => <CalendarAgenda {...base} view="list" period="2026-11-08" />,
};

export const Empty: StoryObj = {
  render: () => <CalendarAgenda {...base} view="list" period="2026-12-01" items={[]} />,
};

export const Loading: StoryObj = {
  render: () => <CalendarAgenda {...base} view="month" loading />,
};

export const LoadError: StoryObj = {
  render: () => <CalendarAgenda {...base} view="month" error onRetry={() => {}} />,
};

export const EntryFormCreate: StoryObj = {
  render: function EntryFormCreateStory() {
    const [open, setOpen] = useState(true);

    return (
      <>
        <Button size="sm" onClick={() => setOpen(true)}>
          Novo compromisso
        </Button>

        <CalendarEntryFormDialog
          open={open}
          onOpenChange={setOpen}
          defaultDay="2026-11-10"
          timeZoneId={ZONE}
          onSave={() => setOpen(false)}
        />
      </>
    );
  },
};

export const EntryFormEdit: StoryObj = {
  render: function EntryFormEditStory() {
    const [open, setOpen] = useState(true);

    return (
      <>
        <Button size="sm" onClick={() => setOpen(true)}>
          Editar compromisso
        </Button>

        <CalendarEntryFormDialog
          open={open}
          onOpenChange={setOpen}
          entry={agenda[0].entry}
          timeZoneId={ZONE}
          onSave={() => setOpen(false)}
        />
      </>
    );
  },
};

export const EntryFormSaving: StoryObj = {
  render: () => (
    <CalendarEntryFormDialog
      open
      onOpenChange={() => {}}
      defaultDay="2026-11-10"
      timeZoneId={ZONE}
      savePending
      onSave={() => {}}
    />
  ),
};

export const EntryFormSaveFailed: StoryObj = {
  render: () => (
    <CalendarEntryFormDialog
      open
      onOpenChange={() => {}}
      defaultDay="2026-11-10"
      timeZoneId={ZONE}
      saveError="Não foi possível salvar o compromisso. Tente de novo."
      onSave={() => {}}
    />
  ),
};
