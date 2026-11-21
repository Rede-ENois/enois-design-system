// O que sai no tarball publicado, ajustado a partir do manifest do repositório.
//
// A instalação por lockfile baixa o tarball pela URL do pacote e depois compara o `version` e os
// `dependencies` do manifest de dentro dele com o que o lock espera. Se divergem, o registro responde
// 405 e o `npm ci` de quem consome morre. O manifest do pacote publicado não pode então carregar os
// scripts do repositório: o `prepare` roda `simple-git-hooks` (que não está nas devDependencies) e o
// `prepublishOnly` roda o build de novo dentro do consumidor. `allowScripts` também não: é ajuste de
// instalação de quem consome, não do pacote.
const CAMPOS_SO_DO_REPOSITORIO = new Set(["scripts", "allowScripts", "devDependencies", "private"]);

/** Manifest do pacote publicado: identidade, exports e as dependências que quem consome instala. */
export function manifestPublicado(manifest) {
  const publico = {};
  for (const [campo, valor] of Object.entries(manifest)) {
    if (!CAMPOS_SO_DO_REPOSITORIO.has(campo)) publico[campo] = valor;
  }
  return publico;
}
