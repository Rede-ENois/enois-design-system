import { useState } from "react";

import { Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayCreateCampaignValues } from "../../types/domain/roleplay/roleplay-create-campaign-values.js";
import type { RoleplaySystemOption } from "../../types/domain/roleplay/roleplay-system-option.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Pill } from "../../ui/pill.js";
import { Textarea } from "../../ui/textarea.js";

import { FormField } from "./form-field.js";

const LIMITS = { name: 120, description: 600, setting: 2000 } as const;

/**
 * Nova campanha. O catálogo de sistemas vem de fora: o DS nunca decide que sistemas existem, e o
 * conteúdo é só apresentação (nome e família), nunca regra de sistema comercial.
 */
export function CreateCampaignDialog({
  open,
  onOpenChange,
  systems,
  pending = false,
  error = null,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  systems: RoleplaySystemOption[];
  pending?: boolean;
  error?: string | null;
  onSubmit: (values: RoleplayCreateCampaignValues) => void;
}) {
  const messages = useMessages().roleplay;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [setting, setSetting] = useState("");
  const [gameSystem, setGameSystem] = useState("");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [tried, setTried] = useState(false);

  const nameError = name.trim() ? null : messages.nameRequired;
  const systemError = gameSystem ? null : messages.systemRequired;

  // Read at submit time: the click handlers see the state of the render that produced them, and a
  // stale closure would judge the form by what it looked like when it opened.
  const submit = () => {
    setTried(true);
    const trimmed = name.trim();
    if (!trimmed || !gameSystem) return;
    const family = systems.find((s) => s.id === gameSystem)?.systemFamily ?? null;
    onSubmit({
      name: trimmed,
      description: description.trim() || null,
      setting: setting.trim() || null,
      gameSystem,
      systemFamily: family,
      visibility,
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setName("");
      setDescription("");
      setSetting("");
      setGameSystem("");
      setVisibility("PUBLIC");
      setTried(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{messages.createTitle}</DialogTitle>

          <DialogDescription>{messages.createHint}</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="min-w-0 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <FormField label={messages.nameLabel} error={tried ? nameError : null}>
            {(control) => (
              <Input
                {...control}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={messages.namePlaceholder}
                maxLength={LIMITS.name}
                showCounter={false}
              />
            )}
          </FormField>

          <FormField label={messages.descriptionLabel} optional={messages.optional}>
            {(control) => (
              <Textarea
                {...control}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={messages.descriptionPlaceholder}
                maxLength={LIMITS.description}
                rows={3}
              />
            )}
          </FormField>

          <FormField label={messages.settingLabel} optional={messages.optional}>
            {(control) => (
              <Textarea
                {...control}
                value={setting}
                onChange={(event) => setSetting(event.target.value)}
                placeholder={messages.settingPlaceholder}
                maxLength={LIMITS.setting}
                rows={3}
              />
            )}
          </FormField>

          <FormField label={messages.systemLabel} error={tried ? systemError : null}>
            {(control) => (
              <select
                {...control}
                value={gameSystem}
                onChange={(event) => setGameSystem(event.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-surface-card px-3 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm [&>option]:bg-surface-card"
              >
                <option value="" disabled>
                  {messages.systemEmpty}
                </option>

                {systems.map((system) => (
                  <option key={system.id} value={system.id}>
                    {system.label}
                    {system.systemFamily &&
                      ` (${messages.systemFamilies[system.systemFamily] ?? system.systemFamily})`}
                  </option>
                ))}
              </select>
            )}
          </FormField>

          <div className="space-y-1.5">
            <p className="text-sm font-medium text-text-strong">{messages.visibilityLabel}</p>

            <div className="flex flex-wrap gap-2">
              <Pill
                size="sm"
                active={visibility === "PUBLIC"}
                onClick={() => setVisibility("PUBLIC")}
              >
                {messages.visibilityPublic}
              </Pill>

              <Pill
                size="sm"
                active={visibility === "PRIVATE"}
                onClick={() => setVisibility("PRIVATE")}
              >
                {messages.visibilityPrivate}
              </Pill>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-full px-4"
              disabled={pending}
              onClick={() => handleOpenChange(false)}
            >
              {messages.cancel}
            </Button>

            <Button type="submit" size="sm" className="h-9 rounded-full px-4" disabled={pending}>
              {pending && <Loader2 className="animate-spin" aria-hidden />}
              {pending ? messages.creating : messages.createAction}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
