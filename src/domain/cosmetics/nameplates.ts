import type { NameplateArt } from "../../types/domain/cosmetics/nameplate-art.js";

/** Nameplates of the seasonal collections (`NAMEPLATE` items), from the approved prototype. */
export const NAMEPLATES: Readonly<Record<string, NameplateArt>> = {
  "placa-mata": {
    background: "linear-gradient(90deg,#14532d,#166534 60%,#15803d)",
    color: "#f0fdf4",
    icons: ["folha", "carapuca"],
  },
  "placa-teia": {
    background: "linear-gradient(90deg,#2e1065,#4c1d95)",
    color: "#f5f3ff",
    icons: ["teia", "morcego"],
  },
  "placa-correnteza": {
    background: "linear-gradient(90deg,#0e7490,#0891b2 60%,#14b8a6)",
    color: "#ecfeff",
    icons: ["onda", "boto"],
  },
  "placa-fogo": {
    background: "linear-gradient(90deg,#7c2d12,#c2410c 60%,#f59e0b)",
    color: "#fff7ed",
    icons: ["chama"],
  },
  "placa-embrulho": {
    background: "repeating-linear-gradient(135deg,#b91c1c 0 10px,#dc2626 10px 20px)",
    color: "#fff",
    icons: ["estrela", "presente"],
  },
  "placa-pinheiro": {
    background: "linear-gradient(90deg,#14532d,#166534)",
    color: "#fefce8",
    icons: ["sino", "guirlanda"],
  },
  "placa-ceu-de-fogos": {
    background: "linear-gradient(90deg,#0f172a,#1e3a8a)",
    color: "#fefce8",
    icons: ["fogos", "fogosVerde"],
  },
  "placa-confete": {
    background: "linear-gradient(90deg,#6d28d9,#c026d3)",
    color: "#fdf4ff",
    icons: ["confete", "mascara"],
  },
  "placa-frevo": {
    background: "linear-gradient(90deg,#ef4444,#facc15,#22c55e,#3b82f6,#a855f7)",
    color: "#1e1b4b",
    icons: ["sombrinha"],
  },
  "placa-chita": {
    background:
      "radial-gradient(circle at 20% 50%,#f472b6 0 6px,transparent 7px),radial-gradient(circle at 60% 30%,#facc15 0 5px,transparent 6px),linear-gradient(90deg,#dc2626,#b91c1c)",
    color: "#fff7ed",
    icons: ["florAzul", "florAmarela"],
  },
  "placa-rosa": {
    background: "linear-gradient(90deg,#fce7f3,#fbcfe8)",
    color: "#9d174d",
    icons: ["coracao", "carta"],
  },
  "placa-cerrado": {
    background: "linear-gradient(90deg,#a16207,#ca8a04 50%,#fde047)",
    color: "#1c1917",
    icons: ["ipe", "arara"],
  },
  // Permanent Essenciais plates.
  "placa-papel": {
    background: "linear-gradient(90deg,#fef3c7,#fde68a)",
    color: "#78350f",
    icons: ["folha", "estrela"],
  },
  "placa-noite-limpa": {
    background: "linear-gradient(90deg,#1e293b,#312e81)",
    color: "#e0e7ff",
    icons: ["estrela", "lua"],
  },
  "placa-jardim": {
    background: "linear-gradient(90deg,#065f46,#15803d)",
    color: "#ecfdf5",
    icons: ["folha", "folhaEscura"],
  },
  "placa-terminal": {
    background: "linear-gradient(90deg,#020617,#0f172a)",
    color: "#4ade80",
    icons: ["cursor", "cafe"],
  },
  "placa-grade": {
    background:
      "repeating-linear-gradient(0deg,transparent 0 9px,rgba(103,70,245,.18) 9px 10px),repeating-linear-gradient(90deg,transparent 0 9px,rgba(103,70,245,.18) 9px 10px),#f5f3ff",
    color: "#3b1fa8",
    icons: ["chip", "merge"],
  },
  "placa-caderno": {
    background: "repeating-linear-gradient(0deg,#fff 0 9px,#bfdbfe 9px 10px)",
    color: "#1e3a8a",
    icons: ["pipa", "pirulito"],
  },
};
