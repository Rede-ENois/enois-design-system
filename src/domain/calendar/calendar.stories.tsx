import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarEntryData } from "../../types/domain/calendar/calendar-entry-data.js";
import { Button } from "../../ui/button.js";

import { CalendarAgendaSurface } from "./calendar-agenda-surface.js";
import { CalendarAgenda } from "./calendar-agenda.js";
import { CalendarEntryFormDialog } from "./calendar-entry-form-dialog.js";
import { CalendarImportDialog } from "./calendar-import-dialog.js";
import { CalendarInterviewDialog } from "./calendar-interview-dialog.js";
import { CalendarSubscriptionCard } from "./calendar-subscription-card.js";

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
export const SubscriptionEmpty: StoryObj = {
  render: () => (
    <CalendarSubscriptionCard
      subscription={null}
      freshUrl={null}
      scope={null}
      onScopeChange={() => {}}
      onCreate={() => {}}
      onRegenerate={() => {}}
      onRevoke={() => {}}
      onCopy={() => {}}
    />
  ),
};

export const SubscriptionFresh: StoryObj = {
  render: () => (
    <CalendarSubscriptionCard
      subscription={{ scope: "SOCIAL", createdAt: "2026-11-10T12:00:00Z" }}
      freshUrl="https://enois.example/calendar/subscribe/abc123.ics"
      scope="SOCIAL"
      onScopeChange={() => {}}
      onCreate={() => {}}
      onRegenerate={() => {}}
      onRevoke={() => {}}
      onCopy={() => {}}
      copied
    />
  ),
};

export const SubscriptionActive: StoryObj = {
  render: () => (
    <CalendarSubscriptionCard
      subscription={{ scope: null, createdAt: "2026-11-10T12:00:00Z" }}
      freshUrl={null}
      scope={null}
      onScopeChange={() => {}}
      onCreate={() => {}}
      onRegenerate={() => {}}
      onRevoke={() => {}}
      onCopy={() => {}}
    />
  ),
};

export const SubscriptionError: StoryObj = {
  render: () => (
    <CalendarSubscriptionCard
      subscription={{ scope: null, createdAt: "2026-11-10T12:00:00Z" }}
      freshUrl={null}
      scope={null}
      onScopeChange={() => {}}
      onCreate={() => {}}
      onRegenerate={() => {}}
      onRevoke={() => {}}
      onCopy={() => {}}
      error="Não foi possível gerar outro link. Tente de novo."
    />
  ),
};

export const ImportDialogEmpty: StoryObj = {
  render: () => (
    <CalendarImportDialog
      open
      onOpenChange={() => {}}
      scope={null}
      onScopeChange={() => {}}
      file={null}
      onFileChange={() => {}}
      onImport={async () => null}
    />
  ),
};

export const ImportDialogWithFile: StoryObj = {
  render: () => (
    <CalendarImportDialog
      open
      onOpenChange={() => {}}
      scope="SOCIAL"
      onScopeChange={() => {}}
      file={new File(["BEGIN:VCALENDAR"], "agenda.ics", { type: "text/calendar" })}
      onFileChange={() => {}}
      onImport={async () => ({ received: 12, created: 9, moved: 2, cancelled: 1, skipped: 0 })}
    />
  ),
};

export const ImportDialogError: StoryObj = {
  render: () => (
    <CalendarImportDialog
      open
      onOpenChange={() => {}}
      scope={null}
      onScopeChange={() => {}}
      file={new File(["BEGIN:VCALENDAR"], "agenda.ics", { type: "text/calendar" })}
      onFileChange={() => {}}
      onImport={async () => null}
      error="Não foi possível importar o arquivo. Tente de novo."
    />
  ),
};

export const InterviewDialogNew: StoryObj = {
  render: () => (
    <CalendarInterviewDialog open onOpenChange={() => {}} timeZoneId={ZONE} onSave={() => {}} />
  ),
};

export const InterviewDialogReschedule: StoryObj = {
  render: () => (
    <CalendarInterviewDialog
      open
      onOpenChange={() => {}}
      timeZoneId={ZONE}
      candidateName="Ana Souza"
      interview={{
        id: "jint_1",
        startsAt: "2026-11-12T17:00:00Z",
        endsAt: "2026-11-12T18:00:00Z",
        timeZoneId: ZONE,
        notes: "Leve seu portfólio.",
      }}
      onSave={() => {}}
    />
  ),
};

export const InterviewDialogError: StoryObj = {
  render: () => (
    <CalendarInterviewDialog
      open
      onOpenChange={() => {}}
      timeZoneId={ZONE}
      saveError="A entrevista precisa ser marcada para o futuro."
      onSave={() => {}}
    />
  ),
};
