/**
 * The direct punishment chosen by the administrator, discriminated by kind: a suspension always
 * carries its length, a permanent ban never does. The union makes the compiler reject the states
 * the panel cannot produce or read (`BAN` without days, `PERMABAN` with days).
 */
export type AdminSanctionRequest = { type: "BAN"; days: number } | { type: "PERMABAN" };
