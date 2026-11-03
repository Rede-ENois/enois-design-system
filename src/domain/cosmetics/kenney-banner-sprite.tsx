import type { OfficialBannerSprite } from "../../types/domain/cosmetics/official-banner-sprite.js";
import { useFxId } from "../avatar/frames/use-fx-id.js";

/**
 * A Kenney (CC0) sprite tinted with `color`, drawn in the banner's 300×100 box. The sprite is a
 * white silhouette, so it becomes an SVG mask and the fill comes from a rect underneath.
 */
export function KenneyBannerSprite({
  src,
  x,
  y,
  size,
  color = "#ffffff",
  opacity = 1,
}: OfficialBannerSprite) {
  const id = useFxId();
  return (
    <g opacity={opacity}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x={x} y={y} width={size} height={size}>
          <image href={src} x={x} y={y} width={size} height={size} />
        </mask>
      </defs>

      <rect x={x} y={y} width={size} height={size} fill={color} mask={`url(#${id})`} />
    </g>
  );
}
