// Gera a página de prova visual do ConfirmDialog (PR #387) com as classes do componente REAL:
// o overlay e o conteúdo vêm de `src/ui/dialog.tsx`, o alerta e o rodapé de `src/ui/confirm-dialog.tsx`.
// O CSS é o build do Storybook (Tailwind compilado do DS), então o desenho é o do pacote.
// As páginas são escritas ao lado das capturas (`docs/proof/confirm-dialog/`), não na raiz.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const storybook = new URL("../storybook-static/", import.meta.url);
const destino = new URL("../docs/proof/confirm-dialog/", import.meta.url);
mkdirSync(destino, { recursive: true });
const index = JSON.parse(readFileSync(new URL("index.json", storybook), "utf8"));
const iframe = readFileSync(new URL("iframe.html", storybook), "utf8");

// O CSS que o iframe carrega (styles do DS e do Storybook).
const folhas = [...iframe.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(
  (m) => m[1],
);

const casos = {
  confirm: {
    titulo: "Excluir post?",
    descricao: "Essa ação não pode ser desfeita.",
    erro: null,
    bloqueado: false,
  },
  indisponivel: {
    titulo: "Excluir comunidade?",
    descricao: "Escolha antes para onde vão as publicações.",
    erro: "Escolha um destino antes de excluir.",
    bloqueado: true,
  },
  erroLongo: {
    titulo: "Excluir comunidade?",
    descricao:
      "Você está prestes a excluir uma comunidade com 412 membros, 1.230 publicações e 98 conversas.",
    erro: "Não foi possível concluir agora: a conexão com o servidor caiu no meio da operação. Tente de novo em alguns segundos e, se continuar, avise a administração.",
    bloqueado: false,
  },
};

/** A mesma árvore que `ConfirmDialog` + `DialogContent` desenham, com as classes do código. */
function dialogo({ titulo, descricao, erro, bloqueado }) {
  return `
  <div data-state="open" class="fixed inset-0 z-50 bg-black/80"></div>
  <div role="dialog" aria-modal="true" data-state="open"
       class="fixed left-[50%] top-[50%] z-50 grid w-[calc(100vw-2rem)] max-w-lg grid-cols-1 translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:max-w-md sm:rounded-lg max-h-[90dvh] overflow-y-auto">
    <div class="flex flex-col space-y-1.5 text-left">
      <h2 class="text-lg font-semibold leading-none tracking-tight">${titulo}</h2>
      <p class="break-words text-sm text-muted-foreground">${descricao}</p>
    </div>
    ${erro ? `<p role="alert" class="break-words text-sm text-text-strong">${erro}</p>` : ""}
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
      <button type="button" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-transparent border border-input hover:bg-accent hover:text-accent-foreground rounded-full">Cancelar</button>
      <button type="button" ${bloqueado ? "disabled" : ""} class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full disabled:pointer-events-none disabled:opacity-50">Excluir</button>
    </div>
  </div>`;
}

for (const [nome, caso] of Object.entries(casos)) {
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>#387 — ConfirmDialog (${nome})</title>
${folhas.map((href) => `<link rel="stylesheet" href="file://${decodeURIComponent(new URL(href, storybook).pathname)}">`).join("\n")}
<style>body{margin:0;min-height:100vh;background:#888;}</style>
</head><body>${dialogo(caso)}</body></html>`;
  writeFileSync(new URL(`prova-387-${nome}.html`, destino), html);
}
console.log("folhas:", folhas.length);
