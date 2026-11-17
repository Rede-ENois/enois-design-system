import { useState } from "react";

import { Loader2, MessageCircle, Mic, MicOff } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayTableView } from "../../types/domain/roleplay/roleplay-table-view.js";
import type { RoleplayTablesPanelProps } from "../../types/domain/roleplay/roleplay-tables-panel-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { LoadingState } from "../../ui/loading-state.js";
import { Pill } from "../../ui/pill.js";
import { Textarea } from "../../ui/textarea.js";

import { FormField } from "./form-field.js";

/** The tables of a campaign: scene, initiative and the Épapo voice, all fed by the app. */
export function RoleplayTablesPanel({
  tables,
  loading = false,
  canCreateTable = false,
  onCreateTable,
  creatingTable = false,
  onJoinVoice,
  joiningVoiceId = null,
  canEditScene = false,
  onSaveScene,
  onAdvanceTurn,
}: RoleplayTablesPanelProps) {
  const messages = useMessages().roleplay;
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-text-strong">{messages.tablesTitle}</h3>

        {canCreateTable && onCreateTable && (
          <Button
            size="sm"
            variant="outline"
            className="w-auto rounded-full"
            onClick={() => setCreateOpen(true)}
          >
            {messages.createTable}
          </Button>
        )}
      </div>

      {loading && <LoadingState label={messages.loading} />}

      {!loading && tables.length === 0 && (
        <p className="text-sm text-text-subtle">{messages.tablesEmpty}</p>
      )}

      <ul className="space-y-3">
        {tables.map((table) => (
          <li key={table.id}>
            <RoleplayTableCard
              table={table}
              onJoinVoice={onJoinVoice}
              joiningVoice={joiningVoiceId === table.id}
              canEditScene={canEditScene}
              onSaveScene={onSaveScene}
              onAdvanceTurn={onAdvanceTurn}
            />
          </li>
        ))}
      </ul>

      {canCreateTable && onCreateTable && (
        <RoleplayCreateTableDialog
          open={createOpen}
          pending={creatingTable}
          onOpenChange={setCreateOpen}
          onSubmit={onCreateTable}
        />
      )}
    </div>
  );
}

function RoleplayTableCard({
  table,
  onJoinVoice,
  joiningVoice,
  canEditScene,
  onSaveScene,
  onAdvanceTurn,
}: {
  table: RoleplayTableView;
  onJoinVoice: (table: RoleplayTableView) => void;
  joiningVoice: boolean;
  canEditScene: boolean;
  onSaveScene: (table: RoleplayTableView, scene: string) => void;
  onAdvanceTurn: (table: RoleplayTableView) => void;
}) {
  const messages = useMessages().roleplay;
  const [scene, setScene] = useState(table.scene ?? "");

  return (
    <section className="surface-card min-w-0 space-y-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="min-w-0 break-words font-semibold text-text-strong">{table.name}</h4>

        <div className="flex items-center gap-2">
          <Pill size="sm">
            {table.voiceOpen ? (
              <>
                <Mic aria-hidden />
                {messages.voiceOpen}
              </>
            ) : (
              <>
                <MicOff aria-hidden />
                {messages.voiceClosed}
              </>
            )}
          </Pill>

          <Button
            size="sm"
            variant="outline"
            className="w-auto rounded-full"
            disabled={joiningVoice}
            onClick={() => onJoinVoice(table)}
          >
            {joiningVoice && <Loader2 className="animate-spin" aria-hidden />}
            <MessageCircle aria-hidden />
            {messages.joinVoice}
          </Button>
        </div>
      </div>

      <div className="min-w-0 space-y-2">
        {canEditScene ? (
          <SceneEditor table={table} scene={scene} onSceneChange={setScene} onSave={onSaveScene} />
        ) : (
          table.scene && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-text-subtle">{messages.sceneLabel}</p>

              <p className="whitespace-pre-line text-sm text-text-strong">{table.scene}</p>
            </div>
          )
        )}

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <p className="text-xs font-medium text-text-subtle">{messages.turnOrder}</p>

          {table.turnOrder.map((name, index) => (
            <Pill key={`${table.id}-${name}-${index}`} size="sm">
              {index + 1}. {name}
            </Pill>
          ))}

          {table.turnOrder.length === 0 && (
            <span className="text-xs text-text-subtle">{messages.noTurn}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-text-subtle">
            {messages.activeTurn}: {table.activeTurn ?? messages.noTurn}
          </p>

          {table.canAdvanceTurn && (
            <Button
              size="sm"
              variant="ghost"
              className="w-auto rounded-full"
              onClick={() => onAdvanceTurn(table)}
            >
              {messages.passTurn}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

function SceneEditor({
  table,
  scene,
  onSceneChange,
  onSave,
}: {
  table: RoleplayTableView;
  scene: string;
  onSceneChange: (value: string) => void;
  onSave: (table: RoleplayTableView, scene: string) => void;
}) {
  const messages = useMessages().roleplay;
  const unchanged = scene === (table.scene ?? "");

  return (
    <div className="min-w-0 space-y-2">
      <Textarea
        aria-label={messages.sceneLabel}
        value={scene}
        onChange={(event) => onSceneChange(event.target.value)}
        placeholder={messages.scenePlaceholder}
        maxLength={2000}
        rows={3}
      />

      <Button
        size="sm"
        variant="outline"
        className="w-auto rounded-full"
        disabled={unchanged}
        onClick={() => onSave(table, scene)}
      >
        {messages.sceneSave}
      </Button>
    </div>
  );
}

function RoleplayCreateTableDialog({
  open,
  pending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => void;
}) {
  const messages = useMessages().roleplay;
  const [name, setName] = useState("");
  const [tried, setTried] = useState(false);
  const nameError = name.trim() ? null : messages.tableRequired;

  const submit = () => {
    setTried(true);
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setName("");
    setTried(false);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setName("");
          setTried(false);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{messages.createTable}</DialogTitle>

          <DialogDescription>{messages.tableNameLabel}</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className={cn("min-w-0 space-y-4")}
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <FormField label={messages.tableNameLabel} error={tried ? nameError : null}>
            {(control) => (
              <Textarea
                {...control}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={messages.tableNamePlaceholder}
                maxLength={80}
                rows={1}
              />
            )}
          </FormField>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-full px-4"
              disabled={pending}
              onClick={() => onOpenChange(false)}
            >
              {messages.cancel}
            </Button>

            <Button type="submit" size="sm" className="h-9 rounded-full px-4" disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              {messages.createTable}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
