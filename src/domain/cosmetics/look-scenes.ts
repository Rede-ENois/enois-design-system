import type { LookSceneSprite } from "../../types/domain/cosmetics/look-scene-sprite.js";

import { KENNEY_SPRITES } from "./kenney-sprites.js";

/**
 * The scene behind each ready-made look: Kenney (CC0) sprites, see `src/assets/kenney/LICENSE.md`.
 * The card is 100×100, so the numbers are percentages of that box. A look without a scene keeps
 * the plain theme gradient.
 */
export const LOOK_SCENES: Readonly<Record<string, readonly LookSceneSprite[]>> = {
  // Essenciais: the everyday scenes the permanent looks are named after.
  "look-papel": [
    { src: KENNEY_SPRITES["fence-01"], x: 0, y: 70, size: 42, color: "#92400e", opacity: 0.45 },
    { src: KENNEY_SPRITES["cloud-01"], x: 4, y: 6, size: 32, color: "#fef3c7", opacity: 0.6 },
    { src: KENNEY_SPRITES["cloud-02"], x: 62, y: 2, size: 26, color: "#fde68a", opacity: 0.45 },
    { src: KENNEY_SPRITES["flower-01"], x: 78, y: 74, size: 16, color: "#d97706", opacity: 0.7 },
  ],
  "look-noite-limpa": [
    { src: KENNEY_SPRITES["star-01"], x: 8, y: 8, size: 16, color: "#fde68a", opacity: 0.9 },
    { src: KENNEY_SPRITES["star-04"], x: 74, y: 14, size: 12, color: "#e0e7ff", opacity: 0.8 },
    { src: KENNEY_SPRITES["magic-05"], x: 40, y: 4, size: 20, color: "#c7d2fe", opacity: 0.6 },
    { src: KENNEY_SPRITES["tree-10"], x: 4, y: 44, size: 44, color: "#c7d2fe", opacity: 0.3 },
    { src: KENNEY_SPRITES["pine-01"], x: 60, y: 46, size: 46, color: "#c7d2fe", opacity: 0.25 },
  ],
  "look-jardim": [
    { src: KENNEY_SPRITES["cloud-01"], x: 6, y: 4, size: 30, color: "#ffffff", opacity: 0.6 },
    { src: KENNEY_SPRITES["tree-06"], x: 2, y: 34, size: 40, color: "#15803d", opacity: 0.55 },
    { src: KENNEY_SPRITES["bush-01"], x: 62, y: 62, size: 34, color: "#166534", opacity: 0.55 },
    { src: KENNEY_SPRITES["grass-05"], x: 40, y: 78, size: 26, color: "#059669", opacity: 0.6 },
    { src: KENNEY_SPRITES["flower-01"], x: 78, y: 74, size: 18, color: "#f472b6", opacity: 0.8 },
  ],
  "look-fim-de-tarde": [
    { src: KENNEY_SPRITES["cloud-02"], x: 8, y: 8, size: 34, color: "#fbbf24", opacity: 0.5 },
    { src: KENNEY_SPRITES["cloud-01"], x: 58, y: 4, size: 28, color: "#f59e0b", opacity: 0.4 },
    {
      src: KENNEY_SPRITES["tree-autumn-01"],
      x: 4,
      y: 40,
      size: 42,
      color: "#b45309",
      opacity: 0.55,
    },
    { src: KENNEY_SPRITES["tree-04"], x: 60, y: 50, size: 36, color: "#92400e", opacity: 0.45 },
    { src: KENNEY_SPRITES["grass-03"], x: 30, y: 82, size: 24, color: "#92400e", opacity: 0.5 },
  ],
  "look-manha-de-domingo": [
    { src: KENNEY_SPRITES["cloud-01"], x: 10, y: 6, size: 32, color: "#ffffff", opacity: 0.7 },
    { src: KENNEY_SPRITES["cloud-02"], x: 60, y: 12, size: 24, color: "#fef3c7", opacity: 0.6 },
    { src: KENNEY_SPRITES["fence-01"], x: 2, y: 64, size: 42, color: "#b45309", opacity: 0.5 },
    { src: KENNEY_SPRITES["pine-01"], x: 66, y: 58, size: 30, color: "#a16207", opacity: 0.45 },
    { src: KENNEY_SPRITES["grass-04"], x: 40, y: 80, size: 24, color: "#a16207", opacity: 0.5 },
  ],
  "look-carta-na-gaveta": [
    { src: KENNEY_SPRITES["star-01"], x: 12, y: 10, size: 14, color: "#fde68a", opacity: 0.8 },
    { src: KENNEY_SPRITES["star-04"], x: 76, y: 6, size: 12, color: "#e0e7ff", opacity: 0.7 },
    { src: KENNEY_SPRITES["tree-bare-01"], x: 6, y: 44, size: 40, color: "#1e293b", opacity: 0.5 },
    { src: KENNEY_SPRITES["tree-05"], x: 62, y: 50, size: 32, color: "#334155", opacity: 0.4 },
    { src: KENNEY_SPRITES["puff-01"], x: 58, y: 66, size: 34, color: "#c7d2fe", opacity: 0.3 },
  ],
  "look-sombra-fresca": [
    { src: KENNEY_SPRITES["tree-02"], x: 0, y: 30, size: 48, color: "#065f46", opacity: 0.55 },
    { src: KENNEY_SPRITES["bush-02"], x: 58, y: 60, size: 36, color: "#047857", opacity: 0.55 },
    { src: KENNEY_SPRITES["tree-15"], x: 62, y: 24, size: 28, color: "#064e3b", opacity: 0.45 },
    { src: KENNEY_SPRITES["grass-05"], x: 34, y: 80, size: 26, color: "#059669", opacity: 0.6 },
  ],
  "look-quintal-ao-meio-dia": [
    { src: KENNEY_SPRITES["cloud-01"], x: 4, y: 4, size: 30, color: "#ffffff", opacity: 0.65 },
    { src: KENNEY_SPRITES["tree-01"], x: 62, y: 26, size: 36, color: "#15803d", opacity: 0.55 },
    { src: KENNEY_SPRITES["fence-01"], x: 0, y: 64, size: 38, color: "#a16207", opacity: 0.5 },
    { src: KENNEY_SPRITES["grass-03"], x: 48, y: 80, size: 24, color: "#059669", opacity: 0.55 },
  ],
  "look-pedra-fria": [
    { src: KENNEY_SPRITES["star-01"], x: 10, y: 8, size: 14, color: "#e0e7ff", opacity: 0.85 },
    { src: KENNEY_SPRITES["star-04"], x: 78, y: 12, size: 12, color: "#ffffff", opacity: 0.75 },
    { src: KENNEY_SPRITES["puff-02"], x: 38, y: 46, size: 40, color: "#ffffff", opacity: 0.25 },
    {
      src: KENNEY_SPRITES["tree-winter-01"],
      x: 4,
      y: 34,
      size: 48,
      color: "#ffffff",
      opacity: 0.45,
    },
    { src: KENNEY_SPRITES["igloo-01"], x: 62, y: 58, size: 34, color: "#ffffff", opacity: 0.4 },
  ],
  "look-nevoeiro": [
    { src: KENNEY_SPRITES["puff-01"], x: 0, y: 40, size: 46, color: "#ffffff", opacity: 0.35 },
    { src: KENNEY_SPRITES["puff-02"], x: 46, y: 52, size: 44, color: "#ffffff", opacity: 0.3 },
    { src: KENNEY_SPRITES["puff-03"], x: 20, y: 66, size: 40, color: "#ffffff", opacity: 0.28 },
    { src: KENNEY_SPRITES["tree-10"], x: 70, y: 34, size: 38, color: "#1e293b", opacity: 0.45 },
  ],
  "look-mar-de-pedra": [
    { src: KENNEY_SPRITES["seaweed-01"], x: 2, y: 48, size: 34, color: "#22d3ee", opacity: 0.5 },
    { src: KENNEY_SPRITES["seaweed-01"], x: 70, y: 56, size: 30, color: "#67e8f9", opacity: 0.4 },
    { src: KENNEY_SPRITES["bubble-01"], x: 30, y: 18, size: 12, color: "#a5f3fc", opacity: 0.7 },
    { src: KENNEY_SPRITES["bubble-01"], x: 62, y: 34, size: 8, color: "#a5f3fc", opacity: 0.6 },
    {
      src: KENNEY_SPRITES["fish-skeleton-01"],
      x: 34,
      y: 52,
      size: 32,
      color: "#67e8f9",
      opacity: 0.6,
    },
    { src: KENNEY_SPRITES["igloo-01"], x: 62, y: 74, size: 24, color: "#a5f3fc", opacity: 0.25 },
  ],
  // Seasonal looks: the same sprites, in the colors of each season.
  "look-saci": [
    { src: KENNEY_SPRITES["tree-07"], x: 2, y: 26, size: 50, color: "#fef3c7", opacity: 0.28 },
    { src: KENNEY_SPRITES["tree-08"], x: 58, y: 34, size: 48, color: "#fef3c7", opacity: 0.24 },
    { src: KENNEY_SPRITES["grass-03"], x: 30, y: 82, size: 26, color: "#fef3c7", opacity: 0.4 },
    { src: KENNEY_SPRITES["puff-01"], x: 34, y: 6, size: 34, color: "#fde68a", opacity: 0.35 },
  ],
  "look-halloween": [
    { src: KENNEY_SPRITES["tree-bare-01"], x: 4, y: 24, size: 56, color: "#f97316", opacity: 0.35 },
    { src: KENNEY_SPRITES["tree-11"], x: 58, y: 30, size: 46, color: "#f97316", opacity: 0.3 },
    { src: KENNEY_SPRITES["puff-02"], x: 18, y: 10, size: 34, color: "#a78bfa", opacity: 0.3 },
    { src: KENNEY_SPRITES["tree-10"], x: 34, y: 56, size: 34, color: "#7c3aed", opacity: 0.3 },
  ],
  "look-folclore": [
    { src: KENNEY_SPRITES["tree-14"], x: 0, y: 30, size: 44, color: "#14532d", opacity: 0.55 },
    { src: KENNEY_SPRITES["bush-03"], x: 58, y: 62, size: 34, color: "#166534", opacity: 0.5 },
    { src: KENNEY_SPRITES["fence-01"], x: 34, y: 70, size: 32, color: "#78350f", opacity: 0.45 },
    { src: KENNEY_SPRITES["puff-03"], x: 30, y: 8, size: 36, color: "#f97316", opacity: 0.3 },
  ],
  "look-natal": [
    {
      src: KENNEY_SPRITES["tree-winter-01"],
      x: 4,
      y: 26,
      size: 52,
      color: "#a5f3fc",
      opacity: 0.35,
    },
    { src: KENNEY_SPRITES["igloo-01"], x: 66, y: 52, size: 32, color: "#f0f9ff", opacity: 0.45 },
    { src: KENNEY_SPRITES["cloud-01"], x: 12, y: 4, size: 26, color: "#ffffff", opacity: 0.6 },
    { src: KENNEY_SPRITES["star-01"], x: 42, y: 10, size: 16, color: "#fde68a", opacity: 0.9 },
  ],
  "look-reveillon": [
    { src: KENNEY_SPRITES["star-01"], x: 8, y: 6, size: 10, color: "#fde68a", opacity: 0.9 },
    { src: KENNEY_SPRITES["star-04"], x: 28, y: 18, size: 8, color: "#e0e7ff", opacity: 0.85 },
    { src: KENNEY_SPRITES["star-04"], x: 52, y: 6, size: 10, color: "#fde68a", opacity: 0.85 },
    { src: KENNEY_SPRITES["star-01"], x: 76, y: 22, size: 9, color: "#fef3c7", opacity: 0.8 },
    { src: KENNEY_SPRITES["star-01"], x: 40, y: 34, size: 7, color: "#fbbf24", opacity: 0.75 },
    { src: KENNEY_SPRITES["tree-04"], x: 2, y: 34, size: 50, color: "#c4b5fd", opacity: 0.25 },
    { src: KENNEY_SPRITES["tree-04"], x: 60, y: 38, size: 46, color: "#c4b5fd", opacity: 0.22 },
  ],
  "look-carnaval": [
    { src: KENNEY_SPRITES["puff-01"], x: 4, y: 8, size: 36, color: "#f0abfc", opacity: 0.42 },
    { src: KENNEY_SPRITES["puff-02"], x: 56, y: 4, size: 34, color: "#fde68a", opacity: 0.42 },
    { src: KENNEY_SPRITES["puff-03"], x: 30, y: 50, size: 36, color: "#67e8f9", opacity: 0.35 },
    { src: KENNEY_SPRITES["star-04"], x: 42, y: 62, size: 16, color: "#fef3c7", opacity: 0.7 },
  ],
  "look-junina": [
    { src: KENNEY_SPRITES["tree-bare-01"], x: 2, y: 42, size: 40, color: "#78350f", opacity: 0.55 },
    { src: KENNEY_SPRITES["fence-01"], x: 48, y: 46, size: 34, color: "#92400e", opacity: 0.5 },
    { src: KENNEY_SPRITES["grass-04"], x: 58, y: 78, size: 30, color: "#92400e", opacity: 0.5 },
    { src: KENNEY_SPRITES["puff-03"], x: 26, y: 10, size: 36, color: "#fbbf24", opacity: 0.3 },
  ],
  "look-namorados": [
    { src: KENNEY_SPRITES["cloud-01"], x: 8, y: 6, size: 30, color: "#fecdd3", opacity: 0.6 },
    { src: KENNEY_SPRITES["cloud-02"], x: 60, y: 14, size: 24, color: "#fbcfe8", opacity: 0.5 },
    { src: KENNEY_SPRITES["flower-01"], x: 6, y: 68, size: 24, color: "#f43f5e", opacity: 0.75 },
    { src: KENNEY_SPRITES["flower-01"], x: 72, y: 72, size: 22, color: "#fb7185", opacity: 0.7 },
  ],
  "look-flor": [
    {
      src: KENNEY_SPRITES["tree-autumn-02"],
      x: 2,
      y: 34,
      size: 44,
      color: "#b45309",
      opacity: 0.45,
    },
    { src: KENNEY_SPRITES["tree-09"], x: 62, y: 40, size: 34, color: "#92400e", opacity: 0.4 },
    { src: KENNEY_SPRITES["bush-04"], x: 30, y: 68, size: 28, color: "#15803d", opacity: 0.5 },
    { src: KENNEY_SPRITES["flower-01"], x: 44, y: 78, size: 20, color: "#f472b6", opacity: 0.75 },
  ],
  "look-dev": [
    { src: KENNEY_SPRITES["cloud-02"], x: 6, y: 8, size: 30, color: "#1e1b4b", opacity: 0.6 },
    { src: KENNEY_SPRITES["fence-01"], x: 58, y: 64, size: 36, color: "#c7d2fe", opacity: 0.25 },
    { src: KENNEY_SPRITES["star-04"], x: 44, y: 30, size: 12, color: "#a5b4fc", opacity: 0.8 },
    { src: KENNEY_SPRITES["igloo-01"], x: 4, y: 54, size: 36, color: "#a5b4fc", opacity: 0.2 },
  ],
  "look-criancas": [
    { src: KENNEY_SPRITES["cloud-01"], x: 4, y: 4, size: 32, color: "#ffffff", opacity: 0.7 },
    { src: KENNEY_SPRITES["cloud-02"], x: 58, y: 10, size: 26, color: "#ffffff", opacity: 0.6 },
    { src: KENNEY_SPRITES["tree-13"], x: 6, y: 46, size: 34, color: "#65a30d", opacity: 0.45 },
    { src: KENNEY_SPRITES["grass-05"], x: 4, y: 78, size: 26, color: "#65a30d", opacity: 0.55 },
    { src: KENNEY_SPRITES["bubble-01"], x: 70, y: 40, size: 14, color: "#7dd3fc", opacity: 0.7 },
  ],
};
