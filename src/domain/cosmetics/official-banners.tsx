import type { OfficialBannerSpec } from "../../types/domain/cosmetics/official-banner-spec.js";

import { KENNEY_SPRITES } from "./kenney-sprites.js";

/** Official banners of the seasonal collections (`BANNER` items), from the approved prototype. */
export const OFFICIAL_BANNERS: Readonly<Record<string, OfficialBannerSpec>> = {
  "banner-saci": {
    sky: ["#fde68a", "#fb923c"],
    ground: "#166534",
    icons: ["redemoinho", "folha", "folhaSeca", "carapuca"],
    count: 10,
    seed: 5,
  },
  "banner-halloween": {
    sky: ["#312e81", "#7c2d12"],
    ground: "#1c1917",
    icons: ["luaCheia", "morcego", "abobora", "fantasma", "morcego"],
    count: 9,
    seed: 8,
  },
  "banner-floresta": {
    sky: ["#bbf7d0", "#14532d"],
    ground: "#0e7490",
    icons: ["folhaEscura", "boto", "vitoria", "folha", "chama"],
    count: 11,
    seed: 12,
  },
  "banner-natal-praia": {
    sky: ["#bae6fd", "#fef3c7"],
    ground: "#fde68a",
    icons: ["coqueiro", "estrela", "presente", "sol", "coqueiro"],
    count: 8,
    seed: 21,
    extra: <path d="M0 74 C80 68 160 78 300 70 V84 H0Z" fill="#38bdf8" />,
  },
  "banner-copacabana": {
    sky: ["#0f172a", "#312e81"],
    ground: "#0c4a6e",
    icons: ["fogos", "fogosVerde", "brilhoDourado"],
    count: 10,
    seed: 31,
    y: [12, 56],
    scale: [1.2, 2.2],
  },
  "banner-bloco": {
    sky: ["#f0abfc", "#fde68a"],
    ground: null,
    icons: ["sombrinha", "confete", "mascara", "pandeiro", "brilho"],
    count: 12,
    seed: 61,
  },
  "banner-arraia": {
    sky: ["#1e1b4b", "#7c2d12"],
    ground: "#78350f",
    icons: ["bandeirinha", "estrelinha", "fogueira", "milho"],
    count: 10,
    seed: 71,
  },
  "banner-cerrado": {
    sky: ["#bae6fd", "#fef9c3"],
    ground: "#a16207",
    icons: ["ipe", "arara", "ipe", "tucano", "beijaflor"],
    count: 11,
    seed: 91,
  },
  "banner-terminal": {
    sky: ["#020617", "#1e1b4b"],
    ground: null,
    icons: ["um", "zero", "cafe", "bug", "um", "zero", "merge"],
    count: 14,
    seed: 101,
    y: [14, 80],
    scale: [0.8, 1.4],
  },
  "banner-pipas": {
    sky: ["#7dd3fc", "#fde68a"],
    ground: "#65a30d",
    icons: ["pipa", "pipaAzul", "pipaAmarela", "bolha"],
    count: 9,
    seed: 121,
  },
  // Permanent Essenciais banners, with Kenney (CC0) sprites over the drawn icons.
  "banner-noite-limpa": {
    sky: ["#0f172a", "#1e1b4b"],
    ground: "#1e293b",
    icons: ["estrela", "lua", "brilho"],
    count: 9,
    seed: 141,
    y: [10, 54],
    sprites: [
      { src: KENNEY_SPRITES["star-01"], x: 20, y: 8, size: 26, color: "#fde68a", opacity: 0.9 },
      { src: KENNEY_SPRITES["star-04"], x: 92, y: 4, size: 18, color: "#e0e7ff", opacity: 0.8 },
      { src: KENNEY_SPRITES["magic-05"], x: 196, y: 12, size: 30, color: "#c7d2fe", opacity: 0.7 },
      { src: KENNEY_SPRITES["star-01"], x: 252, y: 30, size: 16, color: "#fef3c7", opacity: 0.8 },
    ],
  },
  "banner-jardim": {
    sky: ["#bae6fd", "#ecfdf5"],
    ground: "#15803d",
    icons: ["folha", "folhaEscura", "sol"],
    count: 9,
    seed: 151,
    sprites: [
      { src: KENNEY_SPRITES["grass-01"], x: 6, y: 60, size: 36, color: "#166534", front: true },
      { src: KENNEY_SPRITES["grass-02"], x: 56, y: 64, size: 32, color: "#15803d", front: true },
      { src: KENNEY_SPRITES["flower-01"], x: 116, y: 56, size: 32, color: "#f472b6", front: true },
      { src: KENNEY_SPRITES["grass-01"], x: 176, y: 62, size: 34, color: "#166534", front: true },
      { src: KENNEY_SPRITES["grass-02"], x: 238, y: 58, size: 36, color: "#15803d", front: true },
    ],
  },
};
