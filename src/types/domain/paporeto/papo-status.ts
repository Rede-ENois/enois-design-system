/**
 * O estado de trajetória de um assunto em alta: o que o tempo diz sobre ele. Os nomes são
 * estáveis (vêm do backend) e o rótulo é leitura do CONJUNTO, não de ninguém.
 */
export type PapoStatus = "EMERGENTE" | "PERSISTENTE" | "HOT";
