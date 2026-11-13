import { useState } from "react";

import { Gamepad2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import { ListRowSkeletons } from "../../patterns/skeletons/list-row-skeletons.js";
import type { GamesReviewSectionProps } from "../../types/domain/moderation/games-review-section-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { GamePlayer } from "../games/game-player.js";

/** Fila de jogos enviados pela comunidade: testar no mesmo quadro isolado e aprovar/recusar. */
export function GamesReviewSection({
  loading,
  games: jogos,
  pending,
  onApprove,
  onReject,
}: GamesReviewSectionProps) {
  const messages = useMessages().gamesReviewSection;
  const [testando, setTestando] = useState<string | null>(null);
  const [motivos, setMotivos] = useState<Record<string, string>>({});

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-text-subtle">
        {messages.title}
      </h2>

      {loading ? (
        <ListRowSkeletons />
      ) : jogos.length === 0 ? (
        <p className="rounded-2xl border border-border-soft bg-surface-card p-4 text-sm text-text-subtle">
          {messages.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {jogos.map((g) => {
            const motivo = motivos[g.id] ?? "";
            const precisaMotivo = motivo.trim().length === 0;

            return (
              <li
                key={g.id}
                className="space-y-3 rounded-2xl border border-border-soft bg-surface-card p-4"
              >
                <div className="flex gap-3">
                  {g.cover && (
                    <img
                      src={g.cover}
                      alt=""
                      className="h-14 w-24 shrink-0 rounded-lg border border-border-soft object-cover"
                    />
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{g.title}</p>

                    <p className="break-words text-xs text-text-subtle">
                      @{g.username ?? g.userId}
                      {g.submittedAtLabel ? ` · ${g.submittedAtLabel}` : ""}
                      {g.tags ? ` · ${g.tags}` : ""}
                    </p>
                  </div>
                </div>

                {g.description && (
                  <p className="whitespace-pre-line break-words text-sm font-normal text-muted-foreground">
                    {g.description}
                  </p>
                )}

                <p className="break-all text-xs text-text-subtle">{g.url}</p>

                {testando === g.id ? (
                  <GamePlayer url={g.url} title={g.title} aspect={g.aspect} autoStart />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-1.5"
                    onClick={() => setTestando(g.id)}
                  >
                    <Gamepad2 className="h-3.5 w-3.5" />

                    <>{messages.play}</>
                  </Button>
                )}

                <Input
                  value={motivo}
                  onChange={(event) =>
                    setMotivos((current) => ({ ...current, [g.id]: event.target.value }))
                  }
                  placeholder={messages.notePlaceholder}
                  maxLength={300}
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="rounded-full"
                    disabled={pending}
                    onClick={() => onApprove(g.id, motivo)}
                  >
                    {messages.approve}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    disabled={pending || precisaMotivo}
                    onClick={() => onReject(g.id, motivo)}
                  >
                    {messages.reject}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
