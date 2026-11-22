// Prova de tela da fila de denúncias em navegador real (headless Chrome e CDP).
import * as esbuild from "esbuild";
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const raiz = process.cwd();
const dir = mkdtempSync(join(tmpdir(), "prova-356-"));
await esbuild.build({
  stdin: {
    contents: `
      import { useState } from "react";
      import { createRoot } from "react-dom/client";
      import { ReportsSection } from "${join(raiz, "src/domain/index.ts")}";
      import { reportsStoryData } from "${join(raiz, "src/domain/moderation/reports.fixture.ts")}";
      function App() {
        const [log, setLog] = useState([]);
        const [pendente, setPendente] = useState(true);
        const [reports, setReports] = useState(reportsStoryData);
        return (
          <div>
            <p id="log">{log.join(",")}</p>
            <button id="alternar" onClick={() => setPendente((p) => !p)}>alternar</button>
            <ReportsSection
              reports={reports}
              admin={false}
              loading={false}
              error={false}
              pending={pendente}
              onRetry={() => {}}
              onVote={(id, vote) => {
                setLog((l) => [...l, id + ":" + vote]);
                setReports((r) => r.filter((item) => item.reportId !== id));
              }}
            />
          </div>
        );
      }
      createRoot(document.getElementById("raiz")).render(<App />);
    `,
    resolveDir: raiz,
    loader: "tsx",
  },
  bundle: true,
  format: "iife",
  outfile: join(dir, "app.js"),
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "error",
});
writeFileSync(
  join(dir, "index.html"),
  `<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif"><div id="raiz"></div><script src="./app.js"></script></body>`,
);

const chrome = spawn(
  "google-chrome",
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--remote-debugging-port=9333",
    `--user-data-dir=${join(dir, "perfil")}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);
await new Promise((r) => setTimeout(r, 2500));
const [alvo] = (await (await fetch("http://127.0.0.1:9333/json/list")).json()).filter(
  (t) => t.type === "page",
);
const ws = new WebSocket(alvo.webSocketDebuggerUrl);
let id = 0;
const pend = new Map();
const enviar = (method, params = {}) =>
  new Promise((res) => {
    const atual = ++id;
    pend.set(atual, res);
    ws.send(JSON.stringify({ id: atual, method, params }));
  });
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) {
    pend.get(m.id)(m);
    pend.delete(m.id);
  }
};
await new Promise((r) => (ws.onopen = r));
const avaliar = async (expression) =>
  (await enviar("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result
    ?.result?.value;

await enviar("Page.navigate", { url: `file://${join(dir, "index.html")}` });
await new Promise((r) => setTimeout(r, 1500));
const botaoVoto = `[...document.querySelectorAll("button")].find((x) => x.textContent === "Votar para punir")`;
const titulo = `(() => { const t = document.activeElement.textContent ?? ""; const h2 = [...document.querySelectorAll("h2")].find((x) => x.textContent === t); return h2 ? "h2:" + t : document.activeElement.tagName + ":" + t.slice(0, 40); })()`;
const bloqueado = await avaliar(`(() => { const b = ${botaoVoto}; return b && b.disabled; })()`);
const resultado = [];
const cartoes = `[...document.querySelectorAll("ul")].map((u) => u.children.length).filter((n) => n > 0)[0]`;
resultado.push(["fila montada com 3 cartões", await avaliar(cartoes)]);
resultado.push([
  "voto bloqueado com pending",
  await avaliar(
    `(() => { ${botaoVoto}.click(); return document.getElementById("log").textContent; })()`,
  ),
]);
await avaliar(`document.getElementById("alternar").click()`);
await new Promise((r) => setTimeout(r, 300));
await avaliar(`(() => { const b = ${botaoVoto}; b.focus(); b.click(); return true; })()`);
await new Promise((r) => setTimeout(r, 300));
resultado.push([
  "voto liberado sem pending",
  await avaliar(`document.getElementById("log").textContent`),
]);
resultado.push(["cartão votado sai da fila", await avaliar(cartoes)]);
resultado.push(["foco no título depois da remoção", await avaliar(titulo)]);
await avaliar(
  `(() => { const s = document.querySelector("select"); s.value = "SCAM"; s.dispatchEvent(new Event("change", { bubbles: true })); return true; })()`,
);
await new Promise((r) => setTimeout(r, 300));
resultado.push([
  "filtro motivo Golpe",
  await avaliar(`document.querySelector('[role="status"]').textContent`),
]);
for (const [nome, valor] of resultado) console.log(`${nome}: ${JSON.stringify(valor)}`);
console.log("pending inicial no botão:", bloqueado);
ws.close();
chrome.kill();
process.exit(0);
