import { useId } from "react";

import type { LookSceneSprite } from "../../types/domain/cosmetics/look-scene-sprite.js";

import { LOOK_SCENES } from "./look-scenes.js";

/**
 * The scene of a ready-made look, drawn behind the avatar: Kenney (CC0) sprites tinted with the
 * look's own colors. Each sprite is a white silhouette, so it becomes an SVG mask and the fill
 * comes from a rect underneath. A look without a scene draws nothing.
 */
export function LookScene({ lookId }: { lookId: string }) {
  const scenes = LOOK_SCENES[lookId];
  const prefix = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (!scenes) return null;

  return (
    <svg
      className="cos-look__scene"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {scenes.map((sprite: LookSceneSprite, index) => {
        const id = `${prefix}-${index}`;
        return (
          <g key={id} opacity={sprite.opacity ?? 1}>
            <defs>
              <mask
                id={id}
                maskUnits="userSpaceOnUse"
                x={sprite.x}
                y={sprite.y}
                width={sprite.size}
                height={sprite.size}
              >
                <image
                  href={sprite.src}
                  x={sprite.x}
                  y={sprite.y}
                  width={sprite.size}
                  height={sprite.size}
                />
              </mask>
            </defs>

            <rect
              x={sprite.x}
              y={sprite.y}
              width={sprite.size}
              height={sprite.size}
              fill={sprite.color}
              mask={`url(#${id})`}
            />
          </g>
        );
      })}
    </svg>
  );
}
