import { useEffect, useState } from "react";

import { HeartPulse } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { HealthyUsageDialogProps } from "../../types/domain/wellbeing/healthy-usage-dialog-props.js";
import { Button } from "../../ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Pill } from "../../ui/pill.js";
import { Switch } from "../../ui/switch.js";

/**
 * Uso saudável: o lembrete de pausa (local, do aparelho) + o centro de personalização
 * (assuntos preferidos, assuntos que não gosto e módulos desativados — com a fonte única
 * no backend, aplicada na navegação, nos feeds e nas recomendações).
 */
export function HealthyUsageDialog({
  open,
  onOpenChange,
  loadDeviceSettings,
  personalization,
  topics,
  minMinutes,
  maxMinutes,
  savePending = false,
  onBatataModeChange,
  onSave,
}: HealthyUsageDialogProps) {
  const messages = useMessages().healthyUsageDialog;
  const [enabled, setEnabled] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [liked, setLiked] = useState<string[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [disabledModules, setDisabledModules] = useState<string[]>([]);
  const [nightRestReminder, setNightRestReminder] = useState(true);
  const [liteMode, setLiteMode] = useState(false);
  const [batataMode, setBatataMode] = useState(false);
  const [forceMotion, setForceMotion] = useState(false);
  const [cardTilt, setCardTilt] = useState(true);
  // Só aparece para quem o sistema está pedindo menos movimento: nas outras pessoas a chave
  // não teria efeito nenhum e só faria volume.
  const [reducedMotionDevice, setReducedMotionDevice] = useState(false);

  useEffect(() => {
    if (!open) return;
    const device = loadDeviceSettings();
    setEnabled(device.enabled);
    setMinutes(device.minutes);
    setForceMotion(device.forceMotion);
    setCardTilt(device.cardTilt);
    setReducedMotionDevice(device.reducedMotion);
    // Seeds only when the dialog opens, like the device reads it did before.
  }, [open]);

  useEffect(() => {
    if (!open || !personalization) return;
    setLiked(personalization.likedTopics);
    setBlocked(personalization.blockedTopics);
    setDisabledModules(personalization.disabledModules);
    setNightRestReminder(personalization.nightRestReminder);
    setLiteMode(personalization.liteMode);
    setBatataMode(personalization.batataMode);
  }, [open, personalization]);

  // BATATA ja entrega o que o lite entrega (e mais): as animacoes continuam desligadas de
  // qualquer jeito, entao a chave de "manter as animacoes" nao teria efeito nenhum.
  const animationsOff = liteMode || batataMode;

  // Um assunto não pode estar nos dois lados: marcar num remove do outro (o backend recusa
  // o conflito, e a tela evita chegar lá).
  const toggleLiked = (topic: string) => {
    setLiked((current) =>
      current.includes(topic) ? current.filter((value) => value !== topic) : [...current, topic],
    );
    setBlocked((current) => current.filter((value) => value !== topic));
  };

  const toggleBlocked = (topic: string) => {
    setBlocked((current) =>
      current.includes(topic) ? current.filter((value) => value !== topic) : [...current, topic],
    );
    setLiked((current) => current.filter((value) => value !== topic));
  };

  const toggleModule = (module: string, off: boolean) => {
    setDisabledModules((current) =>
      off ? [...current, module] : current.filter((value) => value !== module),
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-normal">
            <HeartPulse className="h-5 w-5 text-primary" />

            <>{messages.title}</>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-1">
          <p className="text-sm text-muted-foreground">{messages.description}</p>

          <label className="flex items-start justify-between gap-3 rounded-2xl border border-border-soft bg-surface-card p-3">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-text-strong">
                {messages.switchLabel}
              </span>

              <span className="mt-0.5 block text-xs text-text-subtle">{messages.switchHint}</span>
            </span>

            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </label>

          <label className="block space-y-1">
            <span className="text-sm font-medium text-text-strong">{messages.minutesLabel}</span>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={minMinutes}
                max={maxMinutes}
                value={minutes}
                disabled={!enabled}
                onChange={(event) => setMinutes(Number(event.target.value))}
                className="w-28"
              />

              <span className="text-sm text-text-subtle">{messages.minutesUnit}</span>
            </div>

            <span className="block text-xs text-text-subtle">{messages.minutesHint}</span>
          </label>

          <label className="flex items-start justify-between gap-3 rounded-2xl border border-border-soft bg-surface-card p-3">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-text-strong">
                {messages.nightRestTitle}
              </span>

              <span className="mt-0.5 block text-xs text-text-subtle">
                {messages.nightRestDescription}
              </span>
            </span>

            <Switch checked={nightRestReminder} onCheckedChange={setNightRestReminder} />
          </label>

          <label className="flex items-start justify-between gap-3 rounded-2xl border border-border-soft bg-surface-card p-3">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-text-strong">
                {messages.liteTitle}
              </span>

              <span className="mt-0.5 block text-xs text-text-subtle">
                {messages.liteDescription}
              </span>

              <span className="mt-1.5 block text-xs text-text-subtle">{messages.liteWhy}</span>
            </span>

            <Switch checked={liteMode} onCheckedChange={setLiteMode} />
          </label>

          <label className="flex items-start justify-between gap-3 rounded-2xl border border-border-soft bg-surface-card p-3">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-text-strong">
                {messages.batataTitle}
              </span>

              <span className="mt-0.5 block text-xs text-text-subtle">
                {messages.batataDescription}
              </span>

              <span className="mt-1.5 block text-xs text-text-subtle">{messages.batataWhy}</span>
            </span>

            <Switch
              checked={batataMode}
              onCheckedChange={(on) => {
                setBatataMode(on);
                // O BATATA muda a cara da tela inteira; o app aplica e grava na hora.
                onBatataModeChange?.(on);
              }}
            />
          </label>

          {reducedMotionDevice && (
            <label className="flex items-start justify-between gap-3 rounded-2xl border border-border-soft bg-surface-card p-3">
              <span className="min-w-0">
                <span className="block text-sm font-medium text-text-strong">
                  {messages.forceMotionTitle}
                </span>

                <span className="mt-0.5 block text-xs text-text-subtle">
                  {messages.forceMotionDescription}
                </span>
              </span>

              <Switch
                checked={forceMotion && !animationsOff}
                disabled={animationsOff}
                onCheckedChange={setForceMotion}
              />
            </label>
          )}

          <label className="flex items-start justify-between gap-3 rounded-2xl border border-border-soft bg-surface-card p-3">
            <span className="min-w-0">
              <span className="block text-sm font-medium text-text-strong">
                {messages.cardTiltTitle}
              </span>

              <span className="mt-0.5 block text-xs text-text-subtle">
                {messages.cardTiltDescription}
              </span>
            </span>

            <Switch checked={cardTilt} onCheckedChange={setCardTilt} />
          </label>

          <section className="space-y-2 border-t border-border-soft pt-4">
            <h3 className="text-sm font-semibold text-text-strong">{messages.likeTitle}</h3>

            <p className="text-xs text-text-subtle">{messages.likeHint}</p>

            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <Pill
                  key={topic.value}
                  active={liked.includes(topic.value)}
                  onClick={() => toggleLiked(topic.value)}
                >
                  {topic.label}
                </Pill>
              ))}
            </div>
          </section>

          <section className="space-y-2 border-t border-border-soft pt-4">
            <h3 className="text-sm font-semibold text-text-strong">{messages.dislikeTitle}</h3>

            <p className="text-xs text-text-subtle">{messages.dislikeHint}</p>

            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <Pill
                  key={topic.value}
                  active={blocked.includes(topic.value)}
                  onClick={() => toggleBlocked(topic.value)}
                >
                  {topic.label}
                </Pill>
              ))}
            </div>
          </section>

          <section className="space-y-2 border-t border-border-soft pt-4">
            <h3 className="text-sm font-semibold text-text-strong">{messages.modulesTitle}</h3>

            <p className="text-xs text-text-subtle">{messages.modulesHint}</p>

            <div className="space-y-1">
              {messages.modules.map((module) => {
                const off = disabledModules.includes(module.id);

                return (
                  <label
                    key={module.id}
                    className="flex items-start justify-between gap-3 rounded-xl px-1 py-2"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm text-text-strong">{module.label}</span>

                      {module.hint && (
                        <span className="mt-0.5 block text-xs text-text-subtle">{module.hint}</span>
                      )}
                    </span>

                    <Switch checked={!off} onCheckedChange={(on) => toggleModule(module.id, !on)} />
                  </label>
                );
              })}
            </div>
          </section>

          <div className="flex justify-end border-t border-border-soft pt-4">
            <Button
              className="rounded-full"
              disabled={savePending}
              onClick={() =>
                onSave({
                  enabled,
                  minutes,
                  liked,
                  blocked,
                  disabledModules,
                  nightRestReminder,
                  liteMode,
                  batataMode,
                  forceMotion,
                  cardTilt,
                })
              }
            >
              {messages.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
