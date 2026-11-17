/** A foto do detalhe pode ainda estar chegando (recarregada pelo deep link) ou ter saído do ar. */
export type ColagemPhotoState = { kind: "loading" } | { kind: "error" } | { kind: "ready" };
