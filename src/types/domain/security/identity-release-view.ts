/**
 * O que a pessoa ve na secao de identidade. O backend manda o estado tecnico e a liberacao; a vista
 * junta os dois nestes cinco casos — e so isso que a tela precisa saber.
 */
export type IdentityReleaseView = "WAITING" | "ELIGIBLE" | "IN_PROGRESS" | "APPROVED" | "DECLINED";
