import "../../../.storybook/storybook.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { PapoPanel } from "../../../src/domain/paporeto/papo-panel.js";
import type { PapoSubjectView } from "../../../src/types/domain/paporeto/papo-subject-view.js";

const assunto = (
  nome: string,
  status: PapoSubjectView["status"],
  crescimento: number | null,
): PapoSubjectView => ({
  subject: nome,
  status,
  pontuacao: 7.4,
  falasPost: 24,
  falasComentario: 41,
  pessoas: 18,
  falasUltimaHora: 6,
  crescimento,
});

// Dois assuntos com compromisso e um cenário de lista vazia — o que o revisor pediu de prova.
const comConteudo: PapoSubjectView[] = [
  assunto("inteligencia artificial na educacao", "HOT", 37.6),
  assunto("reforma da previdencia", "PERSISTENTE", null),
];

const propsBase = {
  estado: "ready" as const,
  falasAnalisadas: 8734,
  filtro: null,
  onFiltroChange: () => {},
  subjectAberto: null,
  onSubjectChange: () => {},
  timeline: null,
  janela: "24h" as const,
  onJanelaChange: () => {},
  publicacoes: null,
  publicacoesEstado: "loading" as const,
  onPublicacoesRetry: () => {},
  onRetry: () => {},
};

function Prova() {
  const vazio = new URLSearchParams(location.search).get("vazio") === "1";
  return (
    <main className="min-h-screen bg-background p-6 text-text">
      <PapoPanel {...propsBase} assuntos={vazio ? [] : comConteudo} />
    </main>
  );
}

const raiz = createRoot(document.getElementById("raiz") as HTMLElement);
raiz.render(
  <StrictMode>
    <Prova />
  </StrictMode>,
);
