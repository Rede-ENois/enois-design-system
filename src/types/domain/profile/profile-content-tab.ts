/**
 * Abas de conteúdo do perfil. Espelham o enum ProfileTab do backend, com uma exceção: a aba
 * DIARIO é só de interface — a linha do tempo unificada mora em /users/{username}/diario e não
 * passa pela listagem de posts do perfil.
 */
export type ProfileContentTab = "ALL" | "POSTS" | "REPLIES" | "REPOSTS" | "MEDIA" | "DIARIO";
