// Captura headless (Chrome via CDP) do card do Papo Reto montado pela prova real (#397).
// Mede overflow horizontal em 1280 e 390, nos cenários "com conteúdo" e "vazio", e coleta
// qualquer erro de console. Saída: PNGs + resultado.json em docs/proof/papo-card/.
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const RAIZ = new URL(".", import.meta.url).pathname;
const OUT = RAIZ;

const CHROME =
  process.env.CHROME ??
  ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium"].find((p) => {
    try {
      return readFileSync(p) && true;
    } catch {
      return false;
    }
  });

function espera(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function comChrome(fn) {
  const perfil = mkdtempSync(join(tmpdir(), "chrome-proof-"));
  const proc = spawn(CHROME, [
    "--headless=new",
    "--remote-debugging-port=0",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    `--user-data-dir=${perfil}`,
    "about:blank",
  ]);
  const wsUrl = await new Promise((resolve, reject) => {
    let buf = "";
    const t = setTimeout(() => reject(new Error("timeout do CDP")), 15000);
    proc.stderr.on("data", (d) => {
      buf += d.toString();
      const m = buf.match(/ws:\/\/[^\s]+/);
      if (m) {
        clearTimeout(t);
        resolve(m[0]);
      }
    });
    proc.on("exit", (c) => reject(new Error(`chrome saiu (${c}): ${buf.slice(0, 400)}`)));
  });
  try {
    await fn(wsUrl);
  } finally {
    proc.kill("SIGKILL");
  }
}

function clienteCdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pendentes = new Map();
  const eventos = [];
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id != null && pendentes.has(msg.id)) {
      const { resolve, reject } = pendentes.get(msg.id);
      pendentes.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    } else if (msg.method) {
      eventos.push(msg);
    }
  });
  const pronto = new Promise((r) => ws.addEventListener("open", r));
  const send = async (method, params = {}, sessionId) => {
    await pronto;
    const mid = ++id;
    return new Promise((resolve, reject) => {
      pendentes.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
    });
  };
  return { send, eventos, fechar: () => ws.close() };
}

async function pagina(wsUrl, largura, altura, url, arquivo, cena) {
  const cdp = clienteCdp(wsUrl);
  // Anexa a uma aba nova do navegador.
  const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
  const cmd = (m, p) => cdp.send(m, p, sessionId);

  const errosConsole = [];
  cdp.eventos.length = 0;
  await cmd("Runtime.enable");
  await cmd("Log.enable");
  await cmd("Page.enable");
  await cmd("Emulation.setDeviceMetricsOverride", {
    width: largura,
    height: altura,
    deviceScaleFactor: 2,
    mobile: largura < 500,
  });
  await cmd("Page.navigate", { url });
  await espera(1200);

  // Erros de console/Log que possam ter vindo nesse intervalo.
  for (const ev of cdp.eventos) {
    if (ev.method === "Runtime.exceptionThrown") {
      errosConsole.push(ev.params.exceptionDetails?.exception?.description ?? "exception");
    }
    if (ev.method === "Log.entryAdded" && ev.params.entry.level === "error") {
      // O favicon ausente não é erro da aplicação; só interessa o que vem do app.
      if (!/favicon/i.test(ev.params.entry.url ?? "")) {
        errosConsole.push(ev.params.entry.text);
      }
    }
    if (ev.method === "Runtime.consoleAPICalled" && ev.params.type === "error") {
      errosConsole.push(ev.params.args.map((a) => a.value ?? a.description).join(" "));
    }
  }

  const medida = await cmd("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const doc = document.documentElement;
      const secao = document.querySelector('section[aria-label]');
      const overflowPagina = doc.scrollWidth - doc.clientWidth;
      let overflowSecao = null;
      if (secao) {
        // A seção não pode estourar a largura que recebeu.
        overflowSecao = secao.scrollWidth - secao.clientWidth;
      }
      const metricas = [...document.querySelectorAll('ol > li')].length;
      return { overflowPagina, overflowSecao, alturaDoc: doc.scrollHeight, itens: metricas };
    })()`,
  });

  const { data } = await cmd("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });
  writeFileSync(join(OUT, arquivo), Buffer.from(data, "base64"));

  await cdp.send("Target.closeTarget", { targetId });
  cdp.fechar();
  return { cena, largura, errores: errosConsole, ...medida.result.value };
}

async function main(wsUrl) {
  const base = process.env.BASE_URL ?? "http://127.0.0.1:8791/index.html";
  const resultados = [];
  for (const [largura, altura] of [
    [1280, 900],
    [390, 844],
  ]) {
    resultados.push(
      await pagina(wsUrl, largura, altura, base, `com-conteudo-${largura}.png`, "com-conteudo"),
    );
    resultados.push(
      await pagina(wsUrl, largura, altura, `${base}?vazio=1`, `vazio-${largura}.png`, "vazio"),
    );
  }
  writeFileSync(join(OUT, "resultado.json"), JSON.stringify(resultados, null, 2));
  console.log(JSON.stringify(resultados, null, 2));
}

comChrome((ws) => main(ws)).catch((e) => {
  console.error(e);
  process.exit(1);
});
