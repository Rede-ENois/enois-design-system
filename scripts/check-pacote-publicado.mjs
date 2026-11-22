// Monta o pacote como a publicação faz e confere o manifest que saiu dentro do tarball. É a leitura
// que o registro faz ao instalar: se o manifest publicado carrega script, dependência de
// desenvolvimento ou a flag de pacote privado, a instalação de quem consome trava (o front recebia
// 405 ao instalar a 0.43.x por lockfile). Os passos são chamados por `node` e não por `npm run`: no
// ciclo de publicação o npm já retirou os scripts do manifest.
//
// Uso: node scripts/check-pacote-publicado.mjs [caminho-do-manifest-do-passo-de-publicação]
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { manifestPublicado } from "./publish-manifest.mjs";

const raiz = new URL("..", import.meta.url);
const pasta = mkdtempSync(join(tmpdir(), "ds-pacote-"));
const manifest = JSON.parse(readFileSync(new URL("package.json", raiz), "utf8"));
const passoSobre = process.argv[2] ? JSON.parse(readFileSync(process.argv[2], "utf8")) : manifest;

function executar(...args) {
  return execFileSync("npm", args, { cwd: raiz, stdio: "pipe", encoding: "utf8" });
}

function reprovar(mensagens) {
  console.error(mensagens.join("\n"));
  process.exitCode = 1;
}

try {
  // O manifest que o `npm pack` enxerga é o do repositório: é dele que sai o tarball publicado.
  const publicado = manifestPublicado(passoSobre);
  executar("pack", "--dry-run", "--json");
  const arquivo = executar("pack", "--ignore-scripts", "--pack-destination", pasta)
    .trim()
    .split("\n")
    .pop();
  const doTarball = JSON.parse(
    execFileSync("tar", ["-xzOf", join(pasta, arquivo), "package/package.json"], {
      encoding: "utf8",
    }),
  );
  const doRepositorio = JSON.parse(readFileSync(new URL("package.json", raiz), "utf8"));

  const reprovacoes = [];
  for (const campo of ["scripts", "allowScripts", "devDependencies", "private"]) {
    if (campo in doRepositorio) reprovacoes.push(`manifest do repositório carrega ${campo}`);
  }
  if (publicado.version !== manifest.version) {
    reprovacoes.push(`version publicado ${publicado.version}, esperado ${manifest.version}`);
  }
  if (!publicado.dependencies || !publicado.peerDependencies) {
    reprovacoes.push("manifest publicado sem dependencies/peerDependencies");
  }
  for (const campo of ["name", "version", "exports", "dependencies", "peerDependencies"]) {
    if (JSON.stringify(doTarball[campo]) !== JSON.stringify(publicado[campo])) {
      reprovacoes.push(`tarball diverge no campo ${campo}`);
    }
  }
  for (const campo of ["scripts", "allowScripts", "devDependencies", "private"]) {
    if (campo in doTarball) reprovacoes.push(`tarball carrega ${campo}`);
  }
  if (reprovacoes.length > 0) {
    reprovar(reprovacoes);
  } else {
    console.log(`ok ${manifest.name}@${publicado.version} publicado`);
  }
} finally {
  rmSync(pasta, { recursive: true, force: true });
}
