import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarEntryData } from "../../types/domain/calendar/calendar-entry-data.js";
import { Button } from "../../ui/button.js";

import { CalendarAgendaSurface } from "./calendar-agenda-surface.js";
import { CalendarAgenda } from "./calendar-agenda.js";
import { CalendarEntryDetail } from "./calendar-entry-detail.js";
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

export const AgendaWithForm: StoryObj = {
  render: function AgendaWithFormStory() {
    const [items, setItems] = useState(agenda);

    return (
      <CalendarAgendaSurface
        view="month"
        onViewChange={() => {}}
        period="2026-11"
        onPeriodChange={() => {}}
        items={items}
        timeZoneId={ZONE}
        today={TODAY}
        selectedDay="2026-11-12"
        onSave={async (values) => {
          // Stands in for the app's mutation: the entry keeps the title the reader typed.
          setItems((current) => [
            ...current,
            {
              entry: {
                id: `cal_story_${current.length}`,
                scope: values.scope,
                kind: values.kind,
                title: values.title,
                description: values.description,
                startsAt: values.startsAt,
                endsAt: values.endsAt,
                timeZoneId: values.timeZoneId,
                allDay: values.allDay,
                cancelledAt: null,
              },
              owner: true,
              participation: null,
            },
          ]);
          return true;
        }}
      />
    );
  },
};

export const AgendaEditRefused: StoryObj = {
  render: function AgendaEditRefusedStory() {
    const [editing, setEditing] = useState<CalendarEntryData | null>(agenda[0].entry);

    return (
      <CalendarAgendaSurface
        view="month"
        onViewChange={() => {}}
        period="2026-11"
        onPeriodChange={() => {}}
        items={agenda}
        timeZoneId={ZONE}
        today={TODAY}
        editingEntry={editing}
        onEditingChange={setEditing}
        saveError="Não foi possível salvar o compromisso. Tente de novo."
        onSave={async () => false}
      />
    );
  },
};

const detailEntry = {
  id: "cal_meeting",
  scope: "PROFESSIONAL" as const,
  kind: "MEETING" as const,
  title: "Revisão do trimestre",
  description: "Trazer os números do mês e a lista do que ficou pendente.",
  day: "2026-11-10",
  start: "10:00",
  end: "11:00",
  timeZoneId: ZONE,
  allDay: false,
  cancelledAt: null,
};

const detailParticipants = [
  { id: "p1", username: "ana", state: "ACCEPTED" as const },
  { id: "p2", username: "bia", state: "INVITED" as const },
];

export const DetailOrganizer: StoryObj = {
  render: () => (
    <CalendarEntryDetail
      entry={detailEntry}
      owner
      participation={null}
      participants={detailParticipants}
      backLabel="Voltar à agenda"
      onBack={() => {}}
      onEdit={() => {}}
      onCancel={() => {}}
      onInvite={async () => true}
      onRemoveParticipant={() => {}}
    />
  ),
};

export const DetailGuest: StoryObj = {
  render: () => (
    <CalendarEntryDetail
      entry={detailEntry}
      owner={false}
      participation="INVITED"
      participants={null}
      backLabel="Voltar à agenda"
      onBack={() => {}}
      onRespond={() => {}}
    />
  ),
};

export const DetailCancelled: StoryObj = {
  render: () => (
    <CalendarEntryDetail
      entry={{ ...detailEntry, cancelledAt: "2026-11-09T12:00:00Z" }}
      owner
      participation={null}
      participants={detailParticipants}
      backLabel="Voltar à agenda"
      onBack={() => {}}
      onEdit={() => {}}
      onCancel={() => {}}
    />
  ),
};
