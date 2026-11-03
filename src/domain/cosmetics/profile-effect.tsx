import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { cn } from "../../lib/utils.js";
import type { ProfileEffectParticle } from "../../types/domain/cosmetics/profile-effect-particle.js";
import type { ProfileEffectProps } from "../../types/domain/cosmetics/profile-effect-props.js";

import { CosmeticIcon } from "./cosmetic-icon.js";
import { motionAllowed } from "./motion-allowed.js";
import { profileEffect, profileEffectParticles } from "./profile-effects.js";

/**
 * A profile effect: particles cross the box that contains it once, on mount and whenever
 * `replayKey` changes, then the layer empties. Nothing plays under reduced motion or lite mode.
 * The layer covers its positioned container and never takes pointer events.
 */
export function ProfileEffect({ effect, replayKey, className }: ProfileEffectProps) {
  const layer = useRef<HTMLSpanElement>(null);
  const [particles, setParticles] = useState<ProfileEffectParticle[] | null>(null);

  useEffect(() => {
    const spec = profileEffect(effect);
    const box = layer.current;
    if (!spec || !box || !motionAllowed()) return;
    setParticles(profileEffectParticles(spec, box.clientWidth, box.clientHeight, Math.random));
    return () => setParticles(null);
  }, [effect, replayKey]);

  // Layout effect: the particles get their first keyframe before the browser paints them.
  useLayoutEffect(() => {
    const box = layer.current;
    if (!particles || !box) return;
    const nodes = Array.from(box.children) as HTMLElement[];
    if (nodes.length !== particles.length || typeof nodes[0]?.animate !== "function") {
      setParticles(null);
      return;
    }
    let finished = 0;
    const animations = particles.map((particle, i) => {
      const animation = nodes[i].animate(particle.keyframes, particle.options);
      animation.onfinish = () => {
        finished += 1;
        if (finished === particles.length) setParticles(null);
      };
      return animation;
    });
    return () => animations.forEach((animation) => animation.cancel());
  }, [particles]);

  return (
    <span ref={layer} aria-hidden className={cn("cos-fx-layer", className)}>
      {particles?.map((particle, i) => (
        <span
          key={i}
          className="cos-fx-layer__particle"
          style={{ width: particle.size, height: particle.size }}
        >
          {particle.sprite ? (
            <span
              className="block h-full w-full"
              style={{
                backgroundColor: particle.color,
                maskImage: `url("${particle.sprite}")`,
                WebkitMaskImage: `url("${particle.sprite}")`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskPosition: "center",
              }}
            />
          ) : particle.icon ? (
            <CosmeticIcon icon={particle.icon} className="block h-full w-full" />
          ) : (
            <svg viewBox="-8 -8 16 16" className="block h-full w-full">
              <circle r={7} fill={particle.color} />
            </svg>
          )}
        </span>
      ))}
    </span>
  );
}
