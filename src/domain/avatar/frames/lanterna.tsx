import type { CSSProperties } from "react";

import { polar, round, seededRandom } from "../avatar-frames.js";

import { useFxId } from "./use-fx-id.js";

const rand = seededRandom(3110);

/** Lobes from the sides to the middle, so the nearer ones overlap the farther ones. */
const LOBES = [
  [58, 9, 22, 57],
  [40, 6, 28, 66],
  [20, 4, 28, 73],
].flatMap(([x, cy, rx, ry]) => [
  { cx: -x, cy, rx, ry },
  { cx: x, cy, rx, ry },
]);
const MIDDLE = { cx: 0, cy: 3, rx: 26, ry: 76 };
const ALL_LOBES = [...LOBES, MIDDLE];

/** A shape given in polar points (radius, angle), as used for the carved grin. */
function carved(points: readonly (readonly [number, number])[]): string {
  return `M${points.map(([r, a]) => polar(r, a).join(" ")).join(" L")} Z`;
}

function eye(side: 1 | -1): string {
  const [x, y] = [54 * side, -37];
  return `M${x - 8 * side} ${y + 6.4} L${x + 1.4 * side} ${y - 8.6} L${x + 8.4 * side} ${y + 7.6} Q${x} ${y + 4} ${x - 8 * side} ${y + 6.4} Z`;
}

const GRIN = carved([
  [57.5, 141],
  [58.4, 152],
  [58.6, 164],
  [63.4, 165],
  [63.6, 174],
  [58.8, 175],
  [58.8, 187],
  [63.6, 188],
  [63.6, 197],
  [58.6, 198],
  [58.2, 208],
  [57.4, 219],
  [62, 214],
  [67, 205],
  [70.4, 195],
  [66.2, 190],
  [66.2, 182],
  [71.4, 181],
  [70.8, 170],
  [66.6, 166],
  [62, 147],
]);

const CARVINGS = [eye(-1), eye(1), GRIN];
const BLOOMS = [
  [-54, -35, 20],
  [54, -35, 20],
  [0, 64, 34],
] as const;

/** The zigzag cut of the lid around the stem; everything above it lifts. */
const SEAM_POINTS = [
  [-33, -60.5],
  [-25, -65],
  [-17, -58.4],
  [-8.5, -64],
  [0, -57.6],
  [8.5, -64],
  [17, -58.4],
  [25, -65],
  [33, -60.5],
];
const SEAM = `M${SEAM_POINTS.map((p) => p.join(" ")).join(" L")}`;
const ABOVE_SEAM = `${SEAM} L33 -100 L-33 -100 Z`;
const BELOW_SEAM = `${SEAM} L33 -100 L100 -100 L100 100 L-100 100 L-100 -100 L-33 -100 Z`;

const EMBERS = Array.from({ length: 9 }, (_, i) => {
  const from = i < 5 ? polar(54, -24 + i * 12) : i < 7 ? [-52, -36] : [52, -36];
  return {
    x: round(from[0] + (rand() - 0.5) * 6),
    y: round(from[1]),
    r: round(0.5 + rand() * 0.6),
    style: {
      "--dx": `${round((rand() - 0.5) * 14)}px`,
      "--dy": `${round(-18 - rand() * 14)}px`,
      animationDuration: `${round(1.8 + rand() * 1.6)}s`,
      animationDelay: `${round(-rand() * 3.4)}s`,
    } as CSSProperties,
  };
});

const SMOKE = [-17, -4, 9, 21].map((x, i) => ({
  x,
  y: x % 2 ? -62 : -60,
  style: {
    "--dx": `${round((rand() - 0.5) * 12)}px`,
    animationDelay: `${round(i * 0.12)}s`,
  } as CSSProperties,
}));

/** Lobe highlights: a thin bright arc down each lobe, toward the light. */
function sheen({ cx, cy, rx, ry }: (typeof ALL_LOBES)[number]): string {
  const x = round(cx - rx * 0.38);
  return `M${x} ${round(cy - ry * 0.8)} Q${round(x - rx * 0.22)} ${cy} ${x} ${round(cy + ry * 0.75)}`;
}

function Lobes({ id }: { id: string }) {
  return (
    <>
      {ALL_LOBES.map((l, i) => (
        <g key={i}>
          <ellipse
            cx={l.cx}
            cy={l.cy}
            rx={l.rx}
            ry={l.ry}
            fill={`url(#${id}-lobe)`}
            stroke="#5c1f08"
            strokeWidth="0.9"
          />
          <path
            d={sheen(l)}
            fill="none"
            stroke="#ffedd5"
            strokeWidth="1.4"
            strokeOpacity="0.22"
            strokeLinecap="round"
          />
        </g>
      ))}
    </>
  );
}

/**
 * Jack-o'-lantern: the portrait sits in the hollow of a carved pumpkin, with triangle eyes and a
 * toothy grin glowing around it. The candle inside flickers on every cut, embers rise and, now and
 * then, the heat makes the lid jump and light and smoke escape through the seam.
 */
export function LanternaFx() {
  const id = useFxId();
  return (
    <svg viewBox="-80 -80 160 160" className="moldura-fx__svg">
      <defs>
        <radialGradient id={`${id}-lobe`} cx="0.36" cy="0.32" r="0.72">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="0.3" stopColor="#f97316" />
          <stop offset="0.72" stopColor="#c2410c" />
          <stop offset="1" stopColor="#6b2109" />
        </radialGradient>

        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff7ed" stopOpacity="0.12" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#1c0701" stopOpacity="0.55" />
        </linearGradient>

        <radialGradient id={`${id}-fire`} cx="0.5" cy="0.62" r="0.7">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="0.3" stopColor="#fde047" />
          <stop offset="0.65" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b4380a" />
        </radialGradient>

        <radialGradient id={`${id}-bloom`}>
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="#fb923c" stopOpacity="0.3" />
          <stop offset="1" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`${id}-flesh`} gradientUnits="userSpaceOnUse" cx="0" cy="30" r="70">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.6" stopColor="#fcd34d" />
          <stop offset="1" stopColor="#d97706" />
        </radialGradient>

        <radialGradient id={`${id}-candle`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="50">
          <stop offset="0.78" stopColor="#f97316" stopOpacity="0" />
          <stop offset="1" stopColor="#fb923c" stopOpacity="0.5" />
        </radialGradient>

        <linearGradient id={`${id}-stem`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3f4a1d" />
          <stop offset="0.45" stopColor="#7c8a3a" />
          <stop offset="1" stopColor="#2c3412" />
        </linearGradient>

        <radialGradient id={`${id}-smoke`}>
          <stop offset="0" stopColor="#d6d3d1" stopOpacity="0.4" />
          <stop offset="1" stopColor="#a8a29e" stopOpacity="0" />
        </radialGradient>

        <clipPath id={`${id}-pumpkin`}>
          {ALL_LOBES.map((l, i) => (
            <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.rx} ry={l.ry} />
          ))}
        </clipPath>

        <clipPath id={`${id}-body`}>
          <path d={BELOW_SEAM} />
        </clipPath>

        <clipPath id={`${id}-lid`}>
          <path d={ABOVE_SEAM} />
        </clipPath>

        <mask
          id={`${id}-hollow`}
          maskUnits="userSpaceOnUse"
          x="-100"
          y="-100"
          width="200"
          height="200"
        >
          <rect x="-100" y="-100" width="200" height="200" fill="#fff" />
          <circle r="50" fill="#000" />
        </mask>
      </defs>

      <g mask={`url(#${id}-hollow)`}>
        <g clipPath={`url(#${id}-body)`}>
          <Lobes id={id} />
          <rect
            x="-80"
            y="-80"
            width="160"
            height="160"
            fill={`url(#${id}-shade)`}
            clipPath={`url(#${id}-pumpkin)`}
          />
        </g>

        <path d={SEAM} fill="none" stroke="#3b1203" strokeWidth="2.2" strokeLinejoin="round" />
        <path
          d={SEAM}
          fill="none"
          stroke="#fde68a"
          strokeWidth="1"
          strokeLinejoin="round"
          className="moldura-lanterna__seam"
        />

        <g className="moldura-lanterna__lid">
          <g clipPath={`url(#${id}-lid)`}>
            <Lobes id={id} />
          </g>

          <path d={SEAM} fill="none" stroke="#7c2d12" strokeWidth="0.8" strokeLinejoin="round" />
          <path
            d="M-3.8 -71 C-4.4 -74.6 -3.4 -78.2 -0.8 -80.8 C0.8 -81.8 3.2 -81.2 4 -79.8 C2.4 -78.2 1.8 -75.2 3 -71.4 C1 -69.8 -1.8 -69.8 -3.8 -71 Z"
            fill={`url(#${id}-stem)`}
            stroke="#1f2508"
            strokeWidth="0.6"
          />
          <path
            d="M-1.8 -70.6 C-2.2 -74.4 -1.4 -77.6 0.4 -80.2 M0.8 -70.6 C0.4 -74 0.8 -76.8 2.4 -79.4"
            fill="none"
            stroke="#1f2508"
            strokeWidth="0.4"
            strokeOpacity="0.7"
          />
          <ellipse
            cx="1.6"
            cy="-80.6"
            rx="2.2"
            ry="1"
            fill="#c8b98a"
            stroke="#4b4a20"
            strokeWidth="0.4"
          />

          <g className="moldura-lanterna__vine" transform="translate(0 -3)">
            <path
              d="M2.6 -70 C8 -72 13 -70 14.6 -66 C16 -62.4 13.4 -60 11 -61.4 C9 -62.6 10 -65.6 12.4 -65"
              fill="none"
              stroke="#4d7c0f"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
            <path
              d="M-2.6 -71 C-9 -74 -16 -72.4 -19.6 -68.6 C-21.6 -66.4 -20.6 -63.2 -18 -63.6"
              fill="none"
              stroke="#4d7c0f"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
            <path
              d="M-19.6 -68.6 C-25 -73.2 -31 -71.6 -32.6 -66.8 C-30.4 -68 -28.4 -67 -28.6 -64.6 C-26.8 -66.4 -24.8 -66 -24 -63.8 C-22.6 -65.6 -21 -66.6 -19.6 -68.6 Z"
              fill="#4d7c0f"
              stroke="#1a2e05"
              strokeWidth="0.5"
            />
            <path d="M-19.6 -68.6 L-29 -67.6" stroke="#1a2e05" strokeWidth="0.4" />
          </g>
        </g>

        <g className="moldura-lanterna__flicker" clipPath={`url(#${id}-pumpkin)`}>
          {BLOOMS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={`url(#${id}-bloom)`} />
          ))}
        </g>

        {CARVINGS.map((d, i) => (
          <g key={i}>
            <path d={d} fill="#2a0c02" stroke="#2a0c02" strokeWidth="2.4" strokeLinejoin="round" />
            <path d={d} fill={`url(#${id}-fire)`} className="moldura-lanterna__flame" />
            <path
              d={d}
              fill="none"
              stroke="#fde68a"
              strokeWidth="0.7"
              strokeLinejoin="round"
              strokeOpacity="0.85"
              transform="translate(0 0.6)"
            />
          </g>
        ))}

        <circle r="52.2" fill="none" stroke={`url(#${id}-flesh)`} strokeWidth="4.4" />
        <circle r="54.4" fill="none" stroke="#7c2d12" strokeWidth="0.8" />
      </g>

      <circle r="50" fill={`url(#${id}-candle)`} className="moldura-lanterna__flicker" />

      {SMOKE.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          <circle
            r="6"
            fill={`url(#${id}-smoke)`}
            className="moldura-fx__particula moldura-lanterna__smoke"
            style={s.style}
          />
        </g>
      ))}

      {EMBERS.map((e, i) => (
        <g key={i} transform={`translate(${e.x} ${e.y})`}>
          <circle
            r={e.r}
            fill="#fde047"
            className="moldura-fx__particula moldura-lanterna__ember"
            style={e.style}
          />
        </g>
      ))}
    </svg>
  );
}
