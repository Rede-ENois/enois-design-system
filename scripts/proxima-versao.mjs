// O contador das releases automáticas: 0.46.0 → 0.46.1 … 0.46.9 → 0.47.0 … 0.47.9 → 0.48.0.
// Três dígitos por minor, 0.46.30 nunca existe. Módulo puro (sem git, sem npm) para o workflow e os
// testes lerem a mesma regra.
//
// A frase carrega o ordinal no lugar de "semver-patch": 0.46.3 é o "third patch for 0.46", não um
// patch genérico — quem lê o resumo da release sabe em que ponto do contador ela está.

const ORDINAIS = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
];

/** A versão que vem depois de `atual` (estável, `x.y.z`); o nono patch já sobe a minor. */
export function proximaVersao(atual) {
  const partes = /^(\d+)\.(\d+)\.(\d+)$/.exec(atual);
  if (!partes) {
    throw new Error(`versão fora do formato x.y.z: ${atual}`);
  }

  const [, major, minor, patch] = partes.map(Number);

  return patch >= 9 ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`;
}

/** A nota da release: "the third patch for 0.46"; a virada de minor é "the first release of 0.47". */
export function fraseDaVersao(versao) {
  const [, minor, patch] = versao.split(".").map(Number);

  return patch === 0
    ? `the first release of 0.${minor}`
    : `the ${ORDINAIS[patch - 1]} patch for 0.${minor}`;
}
