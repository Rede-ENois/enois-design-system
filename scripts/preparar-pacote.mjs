// Antes da publicação: guarda o manifest do repositório em `package.manifest.json` e troca o
// `package.json` pelo manifest do pacote publicado. O `prepublishOnly` do npm roda depois deste passo
// e, como o manifest publicado não tem `prepublishOnly`, só publica o dist já montado.
//
// Roda dentro do ciclo do npm, que já retirou os scripts do manifest: por isso é chamado direto pelo
// `node` e não por `npm run`.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

import { manifestPublicado } from "./publish-manifest.mjs";

const raiz = new URL("..", import.meta.url);
const manifest = new URL("package.json", raiz);
const backup = new URL("package.manifest.json", raiz);

// Rodar duas vezes seguidas não pode gravar o manifest publicado por cima do original.
if (existsSync(backup)) {
  copyFileSync(backup, manifest);
}
copyFileSync(manifest, backup);

const original = JSON.parse(readFileSync(manifest, "utf8"));
writeFileSync(manifest, `${JSON.stringify(manifestPublicado(original), null, 2)}\n`);
