/**
 * Estado do hub do Explorar inteiro: o carregamento das contagens e preferências que acendem os
 * sinais (e filtram as salas) antes da lista pronta — ou a falha em trazê-las.
 */
export type ExploreHubState = { kind: "loading" | "error" | "ready" };
