/**
 * Família de um tema no seletor. São seis, uma por jeito de olhar a tela — não uma por
 * origem técnica: um tema de Java Swing e um de Windows 95 são a mesma família (sistema
 * com cara de desktop), assim como um HUD de fliperama e um mapa de campanha são os dois
 * "jogos". Duas categorias com o mesmo sentido só dividiam o que a pessoa procura.
 *
 * `retro` é a família padrão de tema sem categoria declarada.
 */
export type ThemeCategory = "casa" | "jogos" | "maquinas" | "papel" | "retro" | "web2000";
