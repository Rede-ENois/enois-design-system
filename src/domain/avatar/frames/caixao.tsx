import type { CSSProperties } from "react";

import type { FramePoint as Point } from "../../../types/domain/avatar/frame-point.js";
import { polar, round, seededRandom } from "../avatar-frames.js";

import { batFlight } from "./bat-flight.js";
import { Bat } from "./bat.js";
import { useFxId } from "./use-fx-id.js";

const rand = seededRandom(1031);

/** Head, shoulders and foot, clockwise; every edge stays at least 58 from the center. */
const BODY: readonly Point[] = [
  [-30, -79],
  [30, -79],
  [68, -24],
  [38, 79],
  [-38, 79],
  [-68, -24],
];

/** The polygon moved `d` inwards along each edge normal (negative grows it). */
function inset(points: readonly Point[], d: number): Point[] {
  const lines = points.map((a, i) => {
    const b = points[(i + 1) % points.length];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nx = -(b[1] - a[1]) / length;
    const ny = (b[0] - a[0]) / length;
    return { nx, ny, c: nx * a[0] + ny * a[1] + d };
  });
  return lines.map((l1, i) => {
    const l2 = lines[(i + lines.length - 1) % lines.length];
    const det = l1.nx * l2.ny - l1.ny * l2.nx;
    return [round((l1.c * l2.ny - l2.c * l1.ny) / det), round((l1.nx * l2.c - l2.nx * l1.c) / det)];
  });
}

function outline(points: readonly Point[]): string {
  return `M${points.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
}

function along(a: Point, b: Point, t: number): Point {
  return [round(a[0] + (b[0] - a[0]) * t), round(a[1] + (b[1] - a[1]) * t)];
}

const RIM = inset(BODY, 5);
const LID = inset(BODY, -1.3);
const PANEL = inset(BODY, 7.5);
const LID_LINING = inset(BODY, 4);
const HINGE = `${round(((LID[5][0] + 80) / 160) * 100)}% 50%`;

/** A circle of scallops: the satin ruffle around the portrait. */
function ruffle(r: number, n: number, bulge: number): string {
  let d = "";
  for (let i = 0; i < n; i++) {
    const [x1, y1] = polar(r, (i * 360) / n);
    const [x2, y2] = polar(r, ((i + 1) * 360) / n);
    const chord = 2 * r * Math.sin(Math.PI / n);
    d += `${i ? "" : `M${x1} ${y1} `}A${round(chord / 2 / bulge)} ${round(chord / 2 / bulge)} 0 0 1 ${x2} ${y2} `;
  }
  return `${d}Z`;
}

const RUFFLE = `${ruffle(55.2, 40, 0.92)} M50 0 A50 50 0 1 0 -50 0 A50 50 0 1 0 50 0 Z`;
const PLEATS = Array.from({ length: 40 }, (_, i) => {
  const [x1, y1] = polar(50.4, (i * 360) / 40);
  const [x2, y2] = polar(54.6, (i * 360) / 40);
  return `M${x1} ${y1} L${x2} ${y2}`;
}).join(" ");

/** Long grain lines from head to foot, wavy enough to read as wood at any size. */
const GRAIN = Array.from({ length: 22 }, (_, i) => {
  const x0 = -66 + i * 6.3 + (rand() - 0.5) * 3;
  const amp = 0.6 + rand() * 1.6;
  const freq = 0.03 + rand() * 0.03;
  const phase = rand() * 6;
  let d = "";
  for (let y = -82; y <= 82; y += 4) {
    d += `${y === -82 ? "M" : "L"}${round(x0 + amp * Math.sin(y * freq + phase))} ${y} `;
  }
  return { d, opacity: round(0.18 + rand() * 0.3), width: round(0.3 + rand() * 0.5) };
});

/** Brass handles on the outer walls, as [edge start, edge end, position along it], clockwise. */
const HANDLES = (
  [
    [1, 2, 0.5],
    [2, 3, 0.3],
    [2, 3, 0.72],
    [4, 5, 0.28],
    [4, 5, 0.7],
    [5, 0, 0.5],
  ] as const
).map(([from, to, t]) => {
  const [a, b] = [BODY[from], BODY[to]];
  const [x, y] = along(a, b, t);
  return { x, y, angle: round((Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI) };
});

const STUDS = inset(BODY, 3).flatMap((a, i, line) => {
  const b = line[(i + 1) % line.length];
  const count = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 11));
  return Array.from({ length: count }, (_, j) => along(a, b, j / count));
});

const CROSS = "M-3.6 -60 H3.6 V-44 H17 V-36.6 H3.6 V6 H-3.6 V-36.6 H-17 V-44 H-3.6 Z";

const FOG = Array.from({ length: 12 }, (_, i) => {
  const angle = -170 + i * 30 + (rand() - 0.5) * 12;
  const [x, y] = polar(56, angle);
  const [dx, dy] = polar(10 + rand() * 10, angle);
  return {
    x,
    y,
    rx: round(14 + rand() * 8),
    ry: round(8 + rand() * 4),
    style: {
      "--dx": `${dx}px`,
      "--dy": `${round(dy + 10)}px`,
      animationDelay: `${round(rand() * 0.6)}s`,
    } as CSSProperties,
  };
});

/** Bats leave the coffin when it opens, zigzagging out and growing as they come closer. */
const BATS = [
  {
    path: [
      [14, -20],
      [26, -34],
      [12, -50],
      [42, -64],
      [72, -94],
    ],
    size: 1.4,
    flap: 0.2,
  },
  {
    path: [
      [-8, -16],
      [-24, -28],
      [-8, -46],
      [-40, -58],
      [-64, -96],
    ],
    size: 1.2,
    flap: 0.23,
  },
  {
    path: [
      [6, 18],
      [26, 8],
      [38, 26],
      [64, 6],
      [98, -12],
    ],
    size: 1,
    flap: 0.18,
  },
].map((b, i) => ({
  flap: b.flap,
  phase: -i * 0.07,
  style: {
    ...batFlight(b.path.map(([x, y]) => [x, y] as const)),
    "--s": b.size,
    animationDelay: `${round(-i * 0.15)}s`,
  } as CSSProperties,
}));

const DUST = Array.from({ length: 7 }, (_, i) => {
  const angle = 140 + i * 13.3 + (rand() - 0.5) * 6;
  const [x, y] = polar(72, angle);
  const [dx, dy] = polar(8 + rand() * 6, angle);
  return {
    x,
    y,
    r: round(6 + rand() * 4),
    style: { "--dx": `${dx}px`, "--dy": `${round(dy - 4)}px` } as CSSProperties,
  };
});

function Tufting({ id }: { id: string }) {
  return (
    <>
      <radialGradient id={`${id}-puff`}>
        <stop offset="0" stopColor="#d9434b" />
        <stop offset="0.55" stopColor="#a81d29" />
        <stop offset="1" stopColor="#5c0a12" />
      </radialGradient>

      <radialGradient id={`${id}-button`} cx="0.35" cy="0.35">
        <stop offset="0" stopColor="#f0a3a7" />
        <stop offset="0.5" stopColor="#7a1018" />
        <stop offset="1" stopColor="#2b0306" />
      </radialGradient>

      <pattern
        id={`${id}-tufting`}
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="10" height="10" fill={`url(#${id}-puff)`} />
        {[0, 10].flatMap((x) =>
          [0, 10].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.05" fill={`url(#${id}-button)`} />
          )),
        )}
      </pattern>
    </>
  );
}

function Wood({ id, light }: { id: string; light: string }) {
  return (
    <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={light} />
      <stop offset="0.45" stopColor="#4a2112" />
      <stop offset="0.8" stopColor="#2e130a" />
      <stop offset="1" stopColor="#1c0b05" />
    </linearGradient>
  );
}

function Grain({ clip }: { clip: string }) {
  return (
    <g clipPath={`url(#${clip})`} fill="none" stroke="#140602" strokeLinecap="round">
      {GRAIN.map((g, i) => (
        <path key={i} d={g.d} strokeOpacity={g.opacity} strokeWidth={g.width} />
      ))}
    </g>
  );
}

/**
 * Coffin: a mahogany coffin around the portrait, lined with tufted red satin, a ruffle around the
 * face and a pillow behind the head. It starts shut, knocks twice, the lid swings open on its
 * hinge (real 3D, the satin of its inner side shows) letting out fog and bats, and slams shut
 * again before the loop ends.
 */
export function CaixaoFx() {
  const id = useFxId();
  return (
    <span className="moldura-caixao">
      <svg viewBox="-80 -80 160 160" className="moldura-fx__svg">
        <defs>
          <Tufting id={id} />
          <Wood id={id} light="#5e2c17" />

          <radialGradient id={`${id}-depth`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="80">
            <stop offset="0.62" stopColor="#1a0204" stopOpacity="0" />
            <stop offset="1" stopColor="#1a0204" stopOpacity="0.75" />
          </radialGradient>

          <radialGradient id={`${id}-seat`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="62">
            <stop offset="0.8" stopColor="#000" stopOpacity="0.55" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={`${id}-satin`} gradientUnits="userSpaceOnUse" cx="0" cy="-20" r="80">
            <stop offset="0" stopColor="#fff7f0" />
            <stop offset="0.7" stopColor="#f3dccd" />
            <stop offset="1" stopColor="#b99683" />
          </radialGradient>

          <radialGradient
            id={`${id}-pillow`}
            gradientUnits="userSpaceOnUse"
            cx="-6"
            cy="-68"
            r="34"
          >
            <stop offset="0" stopColor="#fbf7f0" />
            <stop offset="0.45" stopColor="#e9e1d6" />
            <stop offset="0.85" stopColor="#bfb0a8" />
            <stop offset="1" stopColor="#85737a" />
          </radialGradient>

          <linearGradient id={`${id}-brass`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3d58a" />
            <stop offset="0.45" stopColor="#a8741f" />
            <stop offset="1" stopColor="#4a2e08" />
          </linearGradient>

          <radialGradient id={`${id}-fog`}>
            <stop offset="0" stopColor="#ece8f4" stopOpacity="0.42" />
            <stop offset="0.5" stopColor="#d4cde6" stopOpacity="0.2" />
            <stop offset="1" stopColor="#d4cde6" stopOpacity="0" />
          </radialGradient>

          <mask
            id={`${id}-behind`}
            maskUnits="userSpaceOnUse"
            x="-80"
            y="-80"
            width="160"
            height="160"
          >
            <rect x="-80" y="-80" width="160" height="160" fill="#fff" />
            <circle r="50" fill="#000" />
          </mask>

          <clipPath id={`${id}-body`}>
            <path d={`${outline(BODY)} ${outline(RIM)}`} clipRule="evenodd" />
          </clipPath>
        </defs>

        <g fill="none" stroke="#000" strokeLinejoin="round" transform="translate(0.8 2.6)">
          {[
            [8, 0.06],
            [5, 0.08],
            [2.4, 0.14],
          ].map(([width, opacity]) => (
            <path key={width} d={outline(BODY)} strokeWidth={width} strokeOpacity={opacity} />
          ))}
        </g>

        {HANDLES.map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${h.y}) rotate(${h.angle})`}>
            <rect x="-6" y="-3.2" width="2.2" height="3.6" rx="0.6" fill="#3b2405" />
            <rect x="3.8" y="-3.2" width="2.2" height="3.6" rx="0.6" fill="#3b2405" />
            <rect x="-7.5" y="-4.6" width="15" height="2.4" rx="1.2" fill={`url(#${id}-brass)`} />
          </g>
        ))}

        <path d={`${outline(BODY)} ${outline(RIM)}`} fillRule="evenodd" fill={`url(#${id}-wood)`} />
        <Grain clip={`${id}-body`} />
        <path d={outline(BODY)} fill="none" stroke="#0f0502" strokeWidth="1" />
        {HANDLES.map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${h.y}) rotate(${h.angle})`}>
            <path
              d="M-6.6 -3.4 H6.6 A1.1 1.1 0 0 1 6.6 -1.2 H-6.6 A1.1 1.1 0 0 1 -6.6 -3.4 Z"
              fill={`url(#${id}-brass)`}
              stroke="#2b1a04"
              strokeWidth="0.35"
            />
            {[-5.4, 5.4].map((x) => (
              <rect
                key={x}
                x={x - 1.6}
                y="-2.2"
                width="3.2"
                height="3.4"
                rx="0.7"
                fill={`url(#${id}-brass)`}
                stroke="#2b1a04"
                strokeWidth="0.35"
              />
            ))}
          </g>
        ))}

        <path
          d={`${outline(RIM)} M50 0 A50 50 0 1 0 -50 0 A50 50 0 1 0 50 0 Z`}
          fillRule="evenodd"
          fill={`url(#${id}-tufting)`}
        />
        <path d={outline(RIM)} fill={`url(#${id}-depth)`} mask={`url(#${id}-behind)`} />
        <path d={outline(RIM)} fill="none" stroke="#2a0a05" strokeWidth="1.6" strokeOpacity="0.8" />
        <path
          d={outline(inset(BODY, 4.4))}
          fill="none"
          stroke="#c2733f"
          strokeWidth="0.5"
          strokeOpacity="0.55"
        />

        <g mask={`url(#${id}-behind)`}>
          <path
            d="M-27 -52 C-30 -60 -29 -70 -24 -73 C-12 -76 12 -76 24 -73 C29 -70 30 -60 27 -52 Z"
            fill={`url(#${id}-pillow)`}
            stroke="#6f5f6c"
            strokeWidth="0.5"
          />
          <path
            d="M-24.5 -54 C-27 -61 -26 -68.5 -22 -70.6 C-11 -73.2 11 -73.2 22 -70.6 C26 -68.5 27 -61 24.5 -54"
            fill="none"
            stroke="#8f7f8c"
            strokeWidth="0.4"
            strokeDasharray="1 0.9"
          />
          <circle r="62" fill={`url(#${id}-seat)`} />
        </g>

        <path d={RUFFLE} fillRule="evenodd" fill={`url(#${id}-satin)`} />
        <path d={PLEATS} stroke="#9a7563" strokeWidth="0.35" strokeOpacity="0.8" />
        <circle r="50.3" fill="none" stroke="#5b3a2c" strokeWidth="0.6" strokeOpacity="0.6" />

        {FOG.map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y})`}>
            <ellipse
              rx={f.rx}
              ry={f.ry}
              fill={`url(#${id}-fog)`}
              className="moldura-fx__particula moldura-caixao__fog"
              style={f.style}
            />
          </g>
        ))}
      </svg>

      <span className="moldura-caixao__lid" style={{ transformOrigin: HINGE }}>
        <svg viewBox="-80 -80 160 160" className="moldura-fx__svg moldura-caixao__face">
          <defs>
            <Wood id={`${id}l`} light="#7a3a1c" />

            <linearGradient id={`${id}l-panel`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8a4522" />
              <stop offset="0.5" stopColor="#5a2914" />
              <stop offset="1" stopColor="#2f140a" />
            </linearGradient>

            <linearGradient id={`${id}l-silver`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fafaf9" />
              <stop offset="0.35" stopColor="#a8a29e" />
              <stop offset="0.6" stopColor="#e7e5e4" />
              <stop offset="1" stopColor="#57534e" />
            </linearGradient>

            <linearGradient id={`${id}l-sheen`} x1="0" y1="0" x2="1" y2="0.6">
              <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.42" stopColor="#ffe8d6" stopOpacity="0.16" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            <radialGradient id={`${id}l-stud`} cx="0.35" cy="0.35">
              <stop offset="0" stopColor="#fef3c7" />
              <stop offset="0.6" stopColor="#b7791f" />
              <stop offset="1" stopColor="#3b2405" />
            </radialGradient>

            <clipPath id={`${id}l-lid`}>
              <path d={outline(LID)} />
            </clipPath>
          </defs>

          <path d={outline(LID)} fill={`url(#${id}l-wood)`} />
          <Grain clip={`${id}l-lid`} />
          <path d={outline(PANEL)} fill={`url(#${id}l-panel)`} opacity="0.85" />
          <path
            d={outline(PANEL)}
            fill="none"
            stroke="#d08850"
            strokeWidth="0.7"
            strokeOpacity="0.55"
            transform="translate(-0.5 -0.5)"
          />
          <path
            d={outline(PANEL)}
            fill="none"
            stroke="#120502"
            strokeWidth="0.8"
            strokeOpacity="0.7"
            transform="translate(0.5 0.5)"
          />
          <path d={outline(LID)} fill={`url(#${id}l-sheen)`} />
          <path d={outline(LID)} fill="none" stroke="#0f0502" strokeWidth="1.2" />
          <path d={CROSS} fill="#0d0402" opacity="0.55" transform="translate(1.2 1.6)" />
          <path d={CROSS} fill={`url(#${id}l-silver)`} stroke="#44403c" strokeWidth="0.5" />
          <path
            d="M-1.6 -58 V4 M-15 -42 H15"
            stroke="#fff"
            strokeWidth="0.6"
            strokeOpacity="0.55"
          />

          {STUDS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.15" fill={`url(#${id}l-stud)`} />
          ))}
        </svg>

        <svg
          viewBox="-80 -80 160 160"
          className="moldura-fx__svg moldura-caixao__face moldura-caixao__face--inside"
        >
          <defs>
            <Tufting id={`${id}i`} />
            <Wood id={`${id}i`} light="#4a2112" />

            <radialGradient id={`${id}i-depth`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="80">
              <stop offset="0.3" stopColor="#1a0204" stopOpacity="0" />
              <stop offset="1" stopColor="#1a0204" stopOpacity="0.7" />
            </radialGradient>
          </defs>

          <path d={outline(LID)} fill={`url(#${id}i-wood)`} stroke="#0f0502" strokeWidth="1.2" />
          <path d={outline(LID_LINING)} fill={`url(#${id}i-tufting)`} />
          <path d={outline(LID_LINING)} fill={`url(#${id}i-depth)`} />
          <path d={outline(LID_LINING)} fill="none" stroke="#2a0a05" strokeWidth="1.2" />
        </svg>
      </span>

      <svg viewBox="-80 -80 160 160" className="moldura-fx__svg">
        <defs>
          <radialGradient id={`${id}-dust`}>
            <stop offset="0" stopColor="#b5a99a" stopOpacity="0.55" />
            <stop offset="0.6" stopColor="#8a7d6e" stopOpacity="0.2" />
            <stop offset="1" stopColor="#8a7d6e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {DUST.map((d, i) => (
          <g key={i} transform={`translate(${d.x} ${d.y})`}>
            <circle
              r={d.r}
              fill={`url(#${id}-dust)`}
              className="moldura-fx__particula moldura-caixao__dust"
              style={d.style}
            />
          </g>
        ))}

        {BATS.map((b, i) => (
          <g key={i} className="moldura-fx__particula moldura-caixao__bat" style={b.style}>
            <g className="moldura-morcego__flutter">
              <Bat flap={b.flap} phase={b.phase} />
            </g>
          </g>
        ))}
      </svg>
    </span>
  );
}
