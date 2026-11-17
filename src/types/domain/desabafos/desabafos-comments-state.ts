/** Estado do carregamento das acolhidas do desabafo aberto. */
export type DesabafosCommentsState = { kind: "loading" } | { kind: "error" } | { kind: "ready" };
