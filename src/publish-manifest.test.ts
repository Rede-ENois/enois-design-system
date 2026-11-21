import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { manifestPublicado } from "../scripts/publish-manifest.mjs";

const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const publicado = manifestPublicado(manifest);

describe("manifest do pacote publicado", () => {
  it("não carrega script que o consumidor teria de rodar", () => {
    expect(publicado).not.toHaveProperty("scripts");
    expect(publicado).not.toHaveProperty("allowScripts");
  });

  it("não carrega dependência de desenvolvimento nem flag de repositório privado", () => {
    expect(publicado).not.toHaveProperty("devDependencies");
    expect(publicado).not.toHaveProperty("private");
  });

  it("mantém a identidade e os pontos de entrada que o front importa", () => {
    expect(publicado.name).toBe(manifest.name);
    expect(publicado.version).toBe(manifest.version);
    expect(publicado.exports).toEqual(manifest.exports);
  });

  it("mantém as dependências e as peerDependencies intactas, que é o que o lock do consumidor confere", () => {
    expect(publicado.dependencies).toEqual(manifest.dependencies);
    expect(publicado.peerDependencies).toEqual(manifest.peerDependencies);
  });
});
