import { buildProfileCss, themeCollectionById } from "../../lib/theme/build-profile-css.js";
import { cn } from "../../lib/utils.js";
import type { ProfileThemeScopeProps } from "../../types/domain/appearance/profile-theme-scope-props.js";

/**
 * Veste um perfil com o tema que ele escolheu, sem tocar no resto do app.
 *
 * Os tokens ficam no container (`data-profile-theme`), não no `html`: o visual do perfil
 * acompanha quem é dono da página, enquanto menu, notificações e diálogos seguem com o tema
 * de quem está olhando. O CSS vai junto no primeiro render (SSR) — sem troca de visual
 * depois que a página chega.
 */
export function ProfileThemeScope({ look, mode, children, className }: ProfileThemeScopeProps) {
  const collection = themeCollectionById(look?.theme);
  if (!collection || !look) {
    return <>{children}</>;
  }

  const css = buildProfileCss(collection, look, mode);
  return (
    <>
      <style href={`profile-theme-${collection.id}-${mode}`} precedence="default">
        {css}
      </style>

      <div
        className={cn("profile-scope", className)}
        data-profile-theme={collection.id}
        data-profile-header={look.header ?? undefined}
        data-profile-textures={look.textures === false ? "off" : undefined}
      >
        <span className="profile-scope__deco" aria-hidden />
        {children}
      </div>
    </>
  );
}
