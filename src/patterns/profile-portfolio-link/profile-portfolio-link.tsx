import { LayoutGrid } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfilePortfolioLinkProps } from "../../types/patterns/profile-portfolio-link-props.js";
import { buttonVariants } from "../../ui/button-variants.js";

/**
 * O atalho entre o perfil e a vitrine profissional. Fica na coluna do perfil, logo abaixo dos
 * projetos, e é o único caminho para a vitrine: o dono abre o editor, quem visita abre a página
 * publicada.
 */
export function ProfilePortfolioLink({
  href,
  owner,
  icon: Icon = LayoutGrid,
  className,
}: ProfilePortfolioLinkProps) {
  const { profilePortfolioLink } = useMessages();

  return (
    <a
      href={href}
      className={buttonVariants({
        variant: "outline",
        size: "sm",
        className: cn("mt-4 rounded-full", className),
      })}
    >
      <Icon />
      {owner ? profilePortfolioLink.edit : profilePortfolioLink.open}
    </a>
  );
}
