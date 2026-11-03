import type { ProfileNameThemeDefinition } from "../../types/lib/theme/profile-name-theme-definition.js";
import type { SeasonalNameTheme } from "../../types/lib/theme/seasonal-name-theme.js";

/*
 * Web fonts of the seasonal name themes. The design system loads no fonts: the app adds them
 * (Google Fonts: Creepster, Mountains of Christmas 700, Pacifico, Rye, Gochi Hand, Press Start 2P)
 * and the fallbacks keep the name readable until they arrive or when they are blocked.
 */
const CREEPSTER = '"Creepster", "Chiller", Impact, fantasy';
const MOUNTAINS_OF_CHRISTMAS =
  '"Mountains of Christmas", "Apple Chancery", "Segoe Script", cursive';
const PACIFICO = '"Pacifico", "Brush Script MT", "Segoe Script", cursive';
const RYE = '"Rye", Rockwell, "Roboto Slab", Georgia, serif';
const GOCHI_HAND = '"Gochi Hand", "Comic Sans MS", "Chalkboard SE", cursive';

/**
 * Name styles of the seasonal collections, ported from the approved prototype (`NAMES`).
 * `paint` keeps the exact gradient (stops, hard bands, angle); `colors` lists its main colors.
 * `fontSize` is relative to the surrounding name, so display fonts read at the same size.
 */
export const SEASONAL_NAME_THEMES: Record<SeasonalNameTheme, ProfileNameThemeDefinition> = {
  "nome-saci": {
    font: "SYSTEM",
    colors: ["#16a34a", "#65a30d", "#dc2626"],
    paint: "linear-gradient(90deg, #16a34a, #65a30d 45%, #dc2626)",
    className: "",
  },
  "nome-fumaca": {
    font: "SERIF",
    colors: ["#475569", "#94a3b8", "#cbd5e1"],
    paint: "linear-gradient(90deg, #475569, #94a3b8 70%, #cbd5e1)",
    className: "",
  },
  "nome-noite": {
    font: "SYSTEM",
    colors: ["#f97316", "#a855f7"],
    className: "",
  },
  "nome-assombrado": {
    font: "DISPLAY",
    colors: ["#84cc16", "#16a34a"],
    paint: "linear-gradient(180deg, #84cc16, #16a34a)",
    fontFamily: CREEPSTER,
    fontSize: "1.04em",
    className: "",
  },
  "nome-brasa": {
    font: "SYSTEM",
    colors: ["#f59e0b", "#ef4444", "#b91c1c"],
    paint: "linear-gradient(90deg, #f59e0b, #ef4444 60%, #b91c1c)",
    className: "",
  },
  "nome-rio": {
    font: "SYSTEM",
    colors: ["#06b6d4", "#0f766e", "#134e4a"],
    paint: "linear-gradient(90deg, #06b6d4, #0f766e 60%, #134e4a)",
    className: "",
  },
  "nome-lenda": {
    font: "SERIF",
    colors: ["#92400e", "#b45309"],
    className: "",
  },
  "nome-pisca": {
    font: "SYSTEM",
    colors: ["#dc2626", "#16a34a", "#ca8a04", "#2563eb"],
    paint:
      "linear-gradient(90deg, #dc2626 0 20%, #16a34a 20% 40%, #ca8a04 40% 60%, #2563eb 60% 80%, #dc2626 80%)",
    className: "",
  },
  "nome-natalino": {
    font: "CURSIVE",
    colors: ["#b91c1c", "#15803d"],
    fontFamily: MOUNTAINS_OF_CHRISTMAS,
    fontSize: "1.08em",
    className: "",
  },
  "nome-virada": {
    font: "SYSTEM",
    colors: ["#f59e0b", "#fde047", "#b45309"],
    paint: "linear-gradient(90deg, #f59e0b, #fde047 50%, #b45309)",
    className: "",
  },
  "nome-branco": {
    font: "SYSTEM",
    colors: ["#64748b", "#94a3b8", "#475569"],
    paint: "linear-gradient(90deg, #64748b, #94a3b8 50%, #475569)",
    className: "",
  },
  "nome-folia": {
    font: "SYSTEM",
    colors: ["#ec4899", "#f59e0b", "#22c55e", "#3b82f6"],
    className: "",
  },
  "nome-purpurina": {
    font: "CURSIVE",
    colors: ["#db2777", "#f59e0b"],
    fontFamily: PACIFICO,
    fontSize: "0.96em",
    className: "",
  },
  "nome-arrasta-pe": {
    font: "SLAB",
    colors: ["#92400e", "#d97706"],
    fontFamily: RYE,
    fontSize: "0.88em",
    className: "",
  },
  "nome-chita": {
    font: "SYSTEM",
    colors: ["#dc2626", "#ca8a04", "#2563eb"],
    paint: "linear-gradient(90deg, #dc2626 0 33%, #ca8a04 33% 66%, #2563eb 66%)",
    className: "",
  },
  "nome-correio": {
    font: "CURSIVE",
    colors: ["#e11d48", "#f472b6"],
    fontFamily: PACIFICO,
    fontSize: "0.96em",
    className: "",
  },
  "nome-ipe": {
    font: "SYSTEM",
    colors: ["#facc15", "#ca8a04", "#a16207"],
    paint: "linear-gradient(90deg, #facc15, #ca8a04 60%, #a16207)",
    className: "",
  },
  "nome-arara": {
    font: "SYSTEM",
    colors: ["#dc2626", "#2563eb", "#facc15"],
    paint: "linear-gradient(90deg, #dc2626, #2563eb 55%, #facc15)",
    className: "",
  },
  "nome-terminal": {
    font: "MONO",
    colors: ["var(--primary)", "var(--primary)"],
    className: "",
  },
  "nome-8bit": {
    font: "PIXEL",
    colors: ["#6746f5", "#22d3ee"],
    fontSize: "0.6em",
    className: "",
  },
  "nome-fosforo": {
    font: "MONO",
    colors: ["#16a34a", "#4ade80"],
    className: "",
  },
  "nome-giz": {
    font: "COMIC",
    colors: ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6"],
    fontFamily: GOCHI_HAND,
    fontSize: "1.12em",
    className: "",
  },
  // Permanent Essenciais styles: no seasonal font, just paint that works all year.
  "nome-papel": {
    font: "SERIF",
    colors: ["#78350f", "#9a3412", "#b45309"],
    paint: "linear-gradient(90deg, #78350f, #9a3412 55%, #b45309)",
    className: "",
  },
  "nome-noite-limpa": {
    font: "SYSTEM",
    colors: ["#4338ca", "#7c3aed"],
    paint: "linear-gradient(90deg, #4338ca, #7c3aed)",
    className: "",
  },
  "nome-jardim": {
    font: "SYSTEM",
    colors: ["#059669", "#65a30d"],
    paint: "linear-gradient(90deg, #059669, #65a30d)",
    className: "",
  },
};
