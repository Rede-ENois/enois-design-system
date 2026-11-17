/** Estado do carregamento dos comentários da foto aberta. */
export type ColagemCommentsState = { kind: "loading" } | { kind: "error" } | { kind: "ready" };
