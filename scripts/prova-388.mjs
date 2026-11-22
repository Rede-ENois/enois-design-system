// Gera a página de prova visual da figurinha inline (PR #388) a partir do CSS REAL do pacote.
// A página é estática: dois quadros lado a lado, o desenho de ANTES (mídia direta, que é o que o
// código fazia) e o de AGORA (.enois-figurinha), nas duas larguras do gate (1280 e 390).
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

// Só as regras da figurinha e o que a frase já usava; o resto do DS não interfere no recorte.
const recorte = css.slice(css.indexOf("  /* Figurinha no meio do texto"));
const regras = recorte.slice(0, recorte.indexOf("}\n}") + 3);

const figurinha = (classe) =>
  `<img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#ffd166"/><circle cx="11" cy="13" r="2.2" fill="#222"/><circle cx="21" cy="13" r="2.2" fill="#222"/><path d="M10 20q6 6 12 0" stroke="#222" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
  )}" alt="figurinha" class="${classe}">`;

const frase = (classe, rotulo) => `
  <section class="caso">
    <p class="rotulo">${rotulo}</p>
    <p class="linha">Frase com ${figurinha(classe)} figurinha no meio e o resto do texto seguindo na mesma linha, como a pessoa escreveu.</p>
    <p class="so">${figurinha(classe)}</p>
  </section>`;

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>#388 — figurinha inline</title>
<style>
  :root { color-scheme: light; }
  body { margin: 0; font: 16px/1.5 system-ui, sans-serif; background: #fff; color: #111; }
  .faixa { padding: 16px 24px; }
  .largura { max-width: var(--w); margin: 0 auto; }
  .titulo { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: #666; margin: 0 0 12px; }
  .par { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  .col { border: 1px solid #ddd; border-radius: 12px; padding: 16px; }
  .col h3 { margin: 0 0 12px; font-size: 14px; }
  .col.antes h3 { color: #b42318; }
  .col.agora h3 { color: #067647; }
  .rotulo { margin: 0 0 4px; font-size: 12px; color: #666; }
  .linha, .so { margin: 0 0 16px; }
  /* ANTES: o desenho de mídia direta que o código aplicava antes desta PR. */
  .antes .midia { max-height: 320px; margin: 4px 0; border-radius: 12px; border: 1px solid #eee; object-fit: contain; }
${regras}
</style></head>
<body>
  <div class="faixa" style="--w:1280px">
    <div class="largura">
      <p class="titulo">1280 px — desktop</p>
      <div class="par">
        <div class="col antes"><h3>Antes — mídia direta</h3>${frase("midia", "figurinha no meio da frase")}${frase("midia", "parágrafo só com a figurinha")}</div>
        <div class="col agora"><h3>Agora — .enois-figurinha</h3>${frase("enois-figurinha", "figurinha no meio da frase")}${frase("enois-figurinha", "parágrafo só com a figurinha")}</div>
      </div>
    </div>
  </div>
  <div class="faixa" style="--w:390px; background:#f6f6f6">
    <div class="largura">
      <p class="titulo">390 px — celular</p>
      <div class="par" style="grid-template-columns: 1fr">
        <div class="col antes"><h3>Antes — mídia direta</h3>${frase("midia", "figurinha no meio da frase")}${frase("midia", "parágrafo só com a figurinha")}</div>
        <div class="col agora"><h3>Agora — .enois-figurinha</h3>${frase("enois-figurinha", "figurinha no meio da frase")}${frase("enois-figurinha", "parágrafo só com a figurinha")}</div>
      </div>
    </div>
  </div>
</body></html>`;

for (const largura of [1280, 390]) {
  // Recorta a faixa daquela largura: a de 1280 tem duas colunas, a de 390 uma só.
  const faixa = html
    .split('<div class="faixa"')
    .find((parte) => parte.includes(`--w:${largura}px`));
  const pagina = html.replace(/<body>[\s\S]*<\/body>/, `<body><div class="faixa"${faixa}</body>`);
  writeFileSync(new URL(`./prova-388-${largura}.html`, import.meta.url), pagina);
}
console.log("ok");