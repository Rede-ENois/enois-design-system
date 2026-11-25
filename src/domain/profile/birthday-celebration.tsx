import { type CSSProperties, useEffect, useState } from "react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { BirthdayCelebrationProps } from "../../types/domain/profile/birthday-celebration-props.js";
import { motionAllowed } from "../cosmetics/motion-allowed.js";

/**
 * A festa no perfil de quem faz aniversário hoje: figurinhas felizes do É Nóis voando pela tela,
 * balões subindo e confete caindo por alguns segundos, mais um tíquete de parabéns que fica até
 * o visitante fechar. Quem entra no perfil não precisa saber que já tem o selo ao lado do nome.
 *
 * Quem decide se hoje é aniversário é o app (`birthdayToday`, no fuso de Brasília); aqui só
 * acontece a apresentação — nada é buscado, nada é guardado e a festa some sozinha.
 *
 * É um presente, não um pedido: com menos movimento no sistema ou em modo econômico
 * (`motionAllowed`), o visitante recebe o tíquete parado, sem nada voando.
 */

/** Quanto tempo a festa risca a tela; depois disso só o tíquete fica, até ser fechado. */
export const BIRTHDAY_CELEBRATION_MS = 10_000;

const BALLOONS = ["🎈", "🎈", "🎈", "🎉", "🎈", "🎊", "🎈"] as const;
const BALLOON_LEFT = [6, 19, 33, 47, 61, 76, 90] as const;
/** Confete nas cores da festa: rosa do selo, celeiro, crescimento e o roxo da marca. */
const CONFETTI_CLASSES = [
  "birthday-celebration__confetti--love",
  "birthday-celebration__confetti--oportunidade",
  "birthday-celebration__confetti--growth",
  "birthday-celebration__confetti--primary",
] as const;

/**
 * Posições fixas em vez de sorteadas: a mesma festa toda vez, para o teste valer alguma coisa e
 * para ninguém entrar no perfil e ver a decoração piscando em layout diferente.
 */
const STICKER_SPOTS: ReadonlyArray<readonly [left: number, top: number, size: number]> = [
  [6, 18, 40],
  [22, 64, 34],
  [38, 10, 44],
  [54, 46, 32],
  [68, 72, 40],
  [80, 24, 36],
  [90, 58, 34],
  [14, 84, 32],
  [46, 80, 30],
  [74, 8, 30],
  [30, 38, 28],
  [86, 88, 28],
  [60, 16, 24],
];

/** O emoji de festa do aparelho é colorido? Sem isso, a festa vira glifo preto solto. */
function drawsColorEmoji(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return true;
    context.font = "32px sans-serif";
    context.textBaseline = "top";
    context.fillText("🎈", 0, 0);
    const [r, g, b] = Array.from(context.getImageData(16, 16, 1, 1).data);
    return Math.max(r, g, b) - Math.min(r, g, b) > 16;
  } catch {
    // Canvas restrito (imagem bloqueada): melhor não arriscar desenhar glifo preto.
    return false;
  }
}

export function BirthdayCelebration({ name, stickers, className }: BirthdayCelebrationProps) {
  const messages = useMessages().birthdayCelebration;
  const [festa, setFesta] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!motionAllowed() || !drawsColorEmoji()) return;
    setFesta(true);
    const onlyTicket = setTimeout(() => setFesta(false), BIRTHDAY_CELEBRATION_MS);
    return () => clearTimeout(onlyTicket);
  }, []);

  if (dismissed) return null;

  return (
    <div className={cn(className)}>
      {festa && (
        <div
          data-birthday-festa
          className="birthday-celebration pointer-events-none fixed inset-0 z-30 overflow-hidden"
        >
          <div className="birthday-celebration__glow absolute inset-x-0 bottom-0 h-1/3" />

          {BALLOONS.map((balloon, index) => (
            <span
              key={`${balloon}-${index}`}
              className="birthday-celebration__balloon absolute bottom-0 text-3xl sm:text-4xl"
              style={{
                "--birthday-left": `${BALLOON_LEFT[index]}%`,
                "--birthday-delay": `${index * 380}ms`,
              }}
            >
              {balloon}
            </span>
          ))}

          {CONFETTI_CLASSES.map((color, colorIndex) =>
            [0, 1, 2, 3, 4].map((column) => (
              <span
                key={`confetti-${colorIndex}-${column}`}
                className={cn(
                  "birthday-celebration__confetti absolute top-0 h-2 w-1.5 rounded-sm",
                  color,
                )}
                style={{
                  "--birthday-left": `${(column * 21 + colorIndex * 4) % 100}%`,
                  "--birthday-delay": `${(column * 3 + colorIndex) * 180}ms`,
                  "--birthday-duration": `${1_300 + ((column + colorIndex) % 4) * 260}ms`,
                }}
              />
            )),
          )}

          {STICKER_SPOTS.map(([left, top, size], spot) => (
            <img
              key={`${stickers[spot % stickers.length]}-${spot}`}
              src={stickers[spot % stickers.length]}
              alt=""
              draggable={false}
              className="birthday-celebration__sticker absolute select-none"
              style={{
                "--birthday-left": `${left}%`,
                "--birthday-top": `${top}%`,
                "--birthday-size": `${size}px`,
                "--birthday-delay": `${spot * 260}ms`,
              }}
            />
          ))}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6">
        <section
          role="status"
          aria-live="polite"
          className="birthday-celebration__ticket flex items-center gap-3 rounded-2xl border border-signal-love/40 bg-surface-card/95 px-4 py-3 shadow-card backdrop-blur"
        >
          <span aria-hidden className="text-2xl">
            🎂
          </span>

          <div className="text-left">
            <p className="text-sm font-semibold text-text-strong">{messages.title(name)}</p>

            <p className="text-xs text-text-subtle">{messages.body}</p>
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-subtle transition-colors hover:bg-surface-1 hover:text-text-strong"
          >
            <span aria-hidden>✕</span>

            <span className="sr-only">{messages.dismiss}</span>
          </button>
        </section>
      </div>
    </div>
  );
}
