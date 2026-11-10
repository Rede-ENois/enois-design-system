import type { IdentityReleaseView } from "../../types/domain/security/identity-release-view.js";
import type { IdentityVerificationStatus } from "../../types/domain/security/identity-verification-status.js";

/**
 * Traduz o estado tecnico do backend na unica coisa que a tela mostra. A liberacao progressiva vem
 * em `released`: sem convite a pessoa ve "esta chegando", nunca um erro nem a nota de credibilidade.
 *
 * Tentativa recusada ou expirada volta a ser "sua vez chegou" quando ha convite — o projeto trata
 * a recusa como um resultado da verificacao, nao como punicao.
 */
export function resolveIdentityReleaseView(
  status: IdentityVerificationStatus | undefined,
): IdentityReleaseView {
  if (status?.verified || status?.state === "VERIFIED") return "APPROVED";
  if (status?.state === "PENDING") return "IN_PROGRESS";
  if (status?.state === "REJECTED" || status?.state === "EXPIRED") return "DECLINED";
  return status?.released ? "ELIGIBLE" : "WAITING";
}
