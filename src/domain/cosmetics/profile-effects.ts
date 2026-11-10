import type { ProfileEffectParticle } from "../../types/domain/cosmetics/profile-effect-particle.js";
import type { ProfileEffectSpec } from "../../types/domain/cosmetics/profile-effect-spec.js";

import { KENNEY_SPRITES } from "./kenney-sprites.js";

const FALL_SIZE = 16;
const CROSS_GAP_MS = 260;
const SNAKE_DOTS = 16;

/** Profile effects of the seasonal collections (`PROFILE_EFFECT` items), from the prototype. */
export const PROFILE_EFFECTS: Readonly<Record<string, ProfileEffectSpec>> = {
  "efeito-redemoinho": {
    icon: "redemoinho",
    motion: "cross",
    icons: ["redemoinho", "carapuca"],
    count: 2,
    size: 60,
    spin: true,
    gap: 140,
  },
  "efeito-folhas": {
    icon: "folhaSeca",
    motion: "fall",
    icons: ["folha", "folhaSeca", "folhaEscura"],
    count: 24,
    size: FALL_SIZE,
  },
  "efeito-morcegos": {
    icon: "morcego",
    motion: "cross",
    icons: ["morcego"],
    count: 6,
    size: 30,
    gap: 220,
  },
  "efeito-fantasmas": { icon: "fantasma", motion: "rise", icons: ["fantasma"], count: 8, size: 26 },
  "efeito-boitata": { icon: "chama", motion: "snake", icons: [], count: SNAKE_DOTS, size: 18 },
  "efeito-boto": { icon: "boto", motion: "cross", icons: ["boto"], count: 2, size: 40, gap: 600 },
  "efeito-neve": {
    icon: "floco",
    motion: "fall",
    icons: ["floco"],
    count: 26,
    size: 14,
    melt: true,
  },
  "efeito-presentes": {
    icon: "presente",
    motion: "fall",
    icons: ["presente", "presenteAzul"],
    count: 14,
    size: 22,
  },
  "efeito-fogos": {
    icon: "fogos",
    motion: "burst",
    icons: ["fogos", "fogosVerde"],
    count: 6,
    size: 70,
  },
  "efeito-confete": {
    icon: "confete",
    motion: "fall",
    icons: ["confete"],
    count: 26,
    size: FALL_SIZE,
  },
  "efeito-purpurina": {
    icon: "brilho",
    motion: "burst",
    icons: ["brilho", "brilhoDourado"],
    count: 10,
    size: 30,
  },
  "efeito-estrelinhas": {
    icon: "estrelinha",
    motion: "burst",
    icons: ["estrelinha"],
    count: 10,
    size: 36,
  },
  "efeito-correio": { icon: "carta", motion: "cross", icons: ["carta"], count: 1, size: 36 },
  "efeito-coracoes": { icon: "coracao", motion: "rise", icons: ["coracao"], count: 12, size: 20 },
  "efeito-petalas": { icon: "ipe", motion: "fall", icons: ["ipe"], count: 18, size: 14 },
  "efeito-beija-flor": {
    icon: "beijaflor",
    motion: "cross",
    icons: ["beijaflor"],
    count: 1,
    size: 34,
  },
  "efeito-binario": {
    icon: "um",
    motion: "fall",
    icons: ["zero", "um"],
    count: 30,
    size: FALL_SIZE,
  },
  "efeito-bugs": { icon: "bug", motion: "cross", icons: ["bug"], count: 3, size: 24, gap: 300 },
  "efeito-bolhas": { icon: "bolha", motion: "rise", icons: ["bolha"], count: 12, size: 26 },
  "efeito-pipas": {
    icon: "pipa",
    motion: "cross",
    icons: ["pipa", "pipaAzul", "pipaAmarela"],
    count: 3,
    size: 32,
    gap: 400,
  },
  // Permanent Essenciais effects: quiet weather for every season, drawn with Kenney (CC0) sprites.
  "efeito-estrelas": {
    icon: "estrela",
    motion: "fall",
    icons: ["estrela", "brilho"],
    sprites: [KENNEY_SPRITES["star-01"], KENNEY_SPRITES["star-04"], KENNEY_SPRITES["magic-05"]],
    tints: ["#fbbf24", "#a5b4fc", "#fcd34d"],
    count: 14,
    size: FALL_SIZE,
  },
  "efeito-folhas-calmas": {
    icon: "folha",
    motion: "fall",
    icons: ["folha", "folhaEscura"],
    sprites: [
      KENNEY_SPRITES["leaf-01"],
      KENNEY_SPRITES["leaf-02"],
      KENNEY_SPRITES["leaf-03"],
      KENNEY_SPRITES["leaf-04"],
    ],
    tints: ["#34d399", "#059669", "#65a30d", "#10b981"],
    count: 16,
    size: FALL_SIZE,
  },
};

export function profileEffect(id: string | null | undefined): ProfileEffectSpec | null {
  return id && Object.hasOwn(PROFILE_EFFECTS, id) ? PROFILE_EFFECTS[id] : null;
}

function fall(spec: ProfileEffectSpec, i: number, w: number, h: number, rnd: () => number) {
  const x = rnd() * w;
  return {
    keyframes: [
      { transform: `translate(${x}px,-24px) rotate(0)`, opacity: 1 },
      {
        transform: `translate(${x + (rnd() - 0.5) * 60}px,${h + 10}px) rotate(${rnd() * 540}deg)`,
        opacity: spec.melt ? 0 : 1,
      },
    ],
    options: {
      duration: 1800 + rnd() * 1400,
      delay: rnd() * 900,
      easing: "cubic-bezier(.3,.1,.6,1)",
    },
  };
}

function rise(_: ProfileEffectSpec, i: number, w: number, h: number, rnd: () => number) {
  const x = rnd() * w;
  return {
    keyframes: [
      { transform: `translate(${x}px,${h}px) scale(.6)`, opacity: 0 },
      { opacity: 1, offset: 0.2 },
      { transform: `translate(${x + (rnd() - 0.5) * 40}px,-30px) scale(1.1)`, opacity: 0 },
    ],
    options: { duration: 2200 + rnd() * 1200, delay: rnd() * 900, easing: "ease-out" },
  };
}

function cross(spec: ProfileEffectSpec, i: number, w: number, h: number, rnd: () => number) {
  const base = h * (0.2 + rnd() * 0.45);
  const keyframes = Array.from({ length: 13 }, (_, s) => {
    const p = s / 12;
    const y = base - spec.size / 2 + Math.sin(p * Math.PI * 3) * 12;
    return {
      transform: `translate(${-60 + p * (w + 120)}px,${y}px) rotate(${spec.spin ? p * 720 : 0}deg)`,
    };
  });
  return {
    keyframes,
    options: { duration: 2600, delay: i * (spec.gap ?? CROSS_GAP_MS), easing: "linear" },
  };
}

function snake(_: ProfileEffectSpec, k: number, w: number, h: number) {
  const keyframes = Array.from({ length: 17 }, (_, s) => {
    const p = s / 16;
    return {
      transform: `translate(${-40 + p * (w + 80)}px,${h * 0.55 + Math.sin(p * Math.PI * 4) * 16}px)`,
    };
  });
  return { keyframes, options: { duration: 2800, delay: k * 50, easing: "linear" } };
}

function burst(spec: ProfileEffectSpec, i: number, w: number, h: number, rnd: () => number) {
  const x = rnd() * (w - spec.size);
  const y = rnd() * (h - spec.size * 0.7);
  return {
    keyframes: [
      { transform: `translate(${x}px,${y}px) scale(.1)`, opacity: 0 },
      { opacity: 1, offset: 0.2 },
      { transform: `translate(${x}px,${y}px) scale(1.1)`, opacity: 0 },
    ],
    options: { duration: 1300, delay: i * 280, easing: "ease-out" },
  };
}

const MOTIONS = { fall, rise, cross, snake, burst };

/**
 * The particles of one run of an effect over a `w`×`h` box. Pure: the randomness comes in, so
 * a run is reproducible in tests.
 */
export function profileEffectParticles(
  spec: ProfileEffectSpec,
  w: number,
  h: number,
  rnd: () => number,
): ProfileEffectParticle[] {
  return Array.from({ length: spec.count }, (_, i): ProfileEffectParticle => {
    const { keyframes, options } = MOTIONS[spec.motion](spec, i, w, h, rnd);
    const particle: ProfileEffectParticle = {
      size: spec.size,
      keyframes,
      options: { ...options, fill: "both" },
    };
    if (spec.motion === "snake") {
      particle.size = spec.size - i * 0.8;
      particle.color = `hsl(${42 - i * 2} 96% ${58 - i}%)`;
    } else if (spec.sprites?.length) {
      const k = i % spec.sprites.length;
      particle.sprite = spec.sprites[k];
      particle.color = spec.tints?.length ? spec.tints[k % spec.tints.length] : "#ffffff";
    } else {
      particle.icon = spec.icons[i % spec.icons.length];
    }
    return particle;
  });
}
