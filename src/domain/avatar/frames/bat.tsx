import type { CSSProperties } from "react";

import { round } from "../avatar-frames.js";

const MEMBRANE =
  "M1.2 -0.8 C2.6 -2.4 4.2 -3.5 5.8 -3.8 C8 -3.6 10.2 -2.8 12.2 -1.6 C11.3 -0.5 10.9 0.7 11.1 2 C10 1.3 8.8 1.2 8 2 C7.3 1.1 6.1 0.9 5.1 1.6 C4.6 0.9 3.6 0.9 2.8 1.7 C2.4 1.3 1.8 1.2 1.3 1.4 Z";
const BONES = "M5.8 -3.8 L12.2 -1.6 M5.8 -3.8 L11.1 2 M5.8 -3.8 L8 2 M5.8 -3.8 L5.1 1.6";
const LEADING_EDGE = "M1.2 -0.8 C2.6 -2.4 4.2 -3.5 5.8 -3.8 C8 -3.6 10.2 -2.8 12.2 -1.6";
const EARS = "M-1.25 -2.7 L-1.7 -4.9 L-0.35 -3.4 Z M1.25 -2.7 L1.7 -4.9 L0.35 -3.4 Z";

/** A bat seen from the front, 25 wide, centered on its body; `flap` is one wing beat in seconds. */
export function Bat({ flap, phase = 0 }: { flap: number; phase?: number }) {
  const wing = (
    <g className="moldura-morcego__wing">
      <path d={MEMBRANE} fill="#170c1f" fillOpacity="0.94" />
      <path d={BONES} fill="none" stroke="#3d2950" strokeWidth="0.35" strokeLinecap="round" />
      <path
        d={LEADING_EDGE}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="0.45"
        strokeOpacity="0.75"
        strokeLinecap="round"
      />
    </g>
  );
  return (
    <g style={{ "--flap": `${flap}s`, "--phase": `${round(phase)}s` } as CSSProperties}>
      <g className="moldura-morcego__body">
        <g transform="scale(-1 1)">{wing}</g>
        {wing}
        <path d={EARS} fill="#1d1028" />
        <ellipse
          cy="0.6"
          rx="1.6"
          ry="2.5"
          fill="#1d1028"
          stroke="#a78bfa"
          strokeWidth="0.3"
          strokeOpacity="0.5"
        />
        <circle cy="-2.1" r="1.45" fill="#1d1028" />
        <circle cx="-0.55" cy="-2.2" r="0.32" fill="#f87171" />
        <circle cx="0.55" cy="-2.2" r="0.32" fill="#f87171" />
      </g>
    </g>
  );
}
