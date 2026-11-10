import type { CSSProperties } from "react";

import { polar, round, seededRandom } from "../avatar-frames.js";

import { batFlight } from "./bat-flight.js";
import { Bat } from "./bat.js";
import { useFxId } from "./use-fx-id.js";

const rand = seededRandom(1313);
const LOOP = 12;
const FLIGHT_RADIUS = 61;

const STARS = Array.from({ length: 22 }, () => {
  const [x, y] = polar(54 + rand() * 22, rand() * 360);
  return {
    x,
    y,
    r: round(0.35 + rand() * 0.55),
    sparkle: rand() < 0.3,
    style: {
      animationDuration: `${round(1.6 + rand() * 2.4)}s`,
      animationDelay: `${round(-rand() * 4)}s`,
    },
  };
});

const CRATERS = [
  [-6, -4, 4.2],
  [7, 5, 3],
  [4, -9, 2.2],
  [-9, 8, 2.6],
  [10, -3, 1.6],
  [-2, 10, 1.8],
] as const;

const CLOUD =
  "M-24 4 C-25 0 -21 -2.6 -17 -1.6 C-16 -5.6 -10 -7 -7 -3.8 C-5 -8.4 3 -8.6 5.4 -3.6 C8.6 -6 14.4 -4 14.6 0.2 C18.4 0 21 2.4 20 5 C10 6.6 -14 6.6 -24 4 Z";

const CLOUDS = [
  { y: -58, scale: 1.1, duration: 19, delay: -6, from: -70, to: 70 },
  { y: -71, scale: 0.8, duration: 26, delay: -19, from: 72, to: -72 },
].map((c) => ({
  ...c,
  style: {
    "--from": `${c.from}px`,
    "--to": `${c.to}px`,
    animationDuration: `${c.duration}s`,
    animationDelay: `${c.delay}s`,
  } as CSSProperties,
}));

/** Sparks shed by the broom: same flight, a little later, smaller and fainter. */
const TRAIL = Array.from({ length: 9 }, (_, i) => ({
  lag: round((i + 1) * 0.075),
  x: round(-32 - rand() * 2),
  y: round(3.5 + (rand() - 0.5) * 6),
  r: round(1.3 - i * 0.1),
  opacity: round(1 - i * 0.09),
  fall: `${round(3 + rand() * 4)}px`,
}));

const BATS = [
  {
    path: [
      [-34, -64],
      [-14, -82],
      [8, -70],
      [-18, -56],
    ],
    size: 0.52,
    flap: 0.19,
    loop: 7,
  },
  {
    path: [
      [30, -74],
      [42, -58],
      [16, -60],
      [6, -82],
    ],
    size: 0.42,
    flap: 0.16,
    loop: 5.6,
  },
  {
    path: [
      [-54, -44],
      [-44, -58],
      [-62, -62],
      [-68, -48],
    ],
    size: 0.3,
    flap: 0.14,
    loop: 8.4,
  },
].map((b, i) => ({
  size: b.size,
  flap: b.flap,
  phase: -i * 0.05,
  style: {
    ...batFlight(
      b.path.map(([x, y]) => [x, y] as const),
      true,
    ),
    animationDuration: `${b.loop}s`,
    animationDelay: `${round(-i * 1.9)}s`,
  } as CSSProperties,
}));

/** Drawn twice: once stroked (moonlight on the outer edge only) and once filled on top. */
function WitchSilhouette() {
  return (
    <>
      <g className="moldura-bruxa__cape">
        <path d="M1.6 -9.6 C-3 -10 -9 -9 -15 -7 C-19 -5.6 -22 -6.4 -24 -8 C-23.6 -5.4 -21.6 -3 -18.4 -2.6 C-20 -1 -21.6 -0.6 -23.4 -1 C-21 1.4 -17 2.2 -12.6 1.4 C-9 0.8 -6 -0.4 -4 -2.4 C-2 -5 -0.4 -7.6 1.6 -9.6 Z" />
      </g>

      <g className="moldura-bruxa__hair">
        <path d="M3 -13.6 C0 -13 -3 -11.4 -6.6 -8.6 C-4.6 -11.2 -3.8 -12 -3.4 -13 C-5 -12.4 -7.6 -12.2 -9.6 -12.8 C-6.4 -13.8 -2.6 -15 1.4 -14.8 Z" />
      </g>

      <g className="moldura-bruxa__leg">
        <path d="M5 1.6 C7.5 1.8 9.6 2.4 10.6 3.8 L11.2 8 C12.8 8 14.6 7.4 15.8 5.8 C16.2 7.8 14.8 9.6 12 9.8 L9.4 9.8 L9.2 5 C7.6 4.6 6 4 5 3.6 Z" />
      </g>

      <path d="M-4 3 C-4 -2 -2 -7 1 -9.5 C3 -10.5 5 -10 6 -8.5 C7 -6 7.5 -3 8.5 -1 L9 3 C6 5 2 7 -2 9.5 L-5 8 L-7 11 L-9 8.6 L-12 10.6 L-12.5 7.4 C-9 6 -6 4.5 -4 3 Z" />
      <path d="M3.6 -8.6 C6.6 -6.6 9.4 -3.8 12.2 -1.2 L11 0.2 C8.2 -2 5.4 -4.4 2.6 -6.4 Z" />
      <path d="M-1.8 -14.2 C2 -16.4 9 -16.6 13 -14.6 C9 -13.2 2 -13 -1.8 -14.2 Z" />

      <g className="moldura-bruxa__hat">
        <path d="M1 -15.2 C0.6 -19 -0.2 -22.6 -2 -25.2 C-3.2 -26.8 -4.6 -27.9 -6.2 -28.6 C-3.4 -28.2 -0.4 -26.2 2.4 -23.2 C4.6 -20.8 6.8 -18 8.6 -15.4 Z" />
      </g>
    </>
  );
}

function flight(lag = 0): CSSProperties {
  return { animationDelay: `${round(lag - LOOP)}s` };
}

/**
 * Witch: a night sky around the portrait. The full moon rises from behind the photo, clouds
 * drift over it and the witch on her broom flies across the top, crossing right in front of the
 * moon and shedding sparks; she trails the broom a beat behind, and her cape, hair, hat and boot
 * keep moving with the flight.
 */
export function BruxaFx() {
  const id = useFxId();
  return (
    <svg viewBox="-80 -80 160 160" className="moldura-fx__svg">
      <defs>
        <radialGradient id={`${id}-night`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="80">
          <stop offset="0.6" stopColor="#0f0a24" stopOpacity="0.95" />
          <stop offset="0.8" stopColor="#1e1650" stopOpacity="0.6" />
          <stop offset="1" stopColor="#1e1650" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`${id}-moon`} cx="0.42" cy="0.38">
          <stop offset="0" stopColor="#fffdf2" />
          <stop offset="0.55" stopColor="#fdf0c2" />
          <stop offset="0.9" stopColor="#f6d27a" />
          <stop offset="1" stopColor="#e9b44c" />
        </radialGradient>

        <radialGradient id={`${id}-moonlight`}>
          <stop offset="0.45" stopColor="#fde68a" stopOpacity="0.45" />
          <stop offset="0.7" stopColor="#f59e0b" stopOpacity="0.12" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${id}-cloud`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c4683" />
          <stop offset="0.6" stopColor="#262049" />
          <stop offset="1" stopColor="#15112d" />
        </linearGradient>

        <linearGradient id={`${id}-straw`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a16207" />
          <stop offset="1" stopColor="#5b3a0d" />
        </linearGradient>

        <radialGradient id={`${id}-spark`}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.35" stopColor="#e9d5ff" />
          <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>

        <mask
          id={`${id}-behind`}
          maskUnits="userSpaceOnUse"
          x="-110"
          y="-110"
          width="220"
          height="220"
        >
          <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
          <circle r="50" fill="#000" />
        </mask>
      </defs>

      <circle r="80" fill={`url(#${id}-night)`} mask={`url(#${id}-behind)`} />

      {STARS.map((s, i) => (
        <g key={i} transform={`translate(${s.x} ${s.y})`}>
          {s.sparkle ? (
            <path
              d="M0 -2.4 L0.45 -0.45 L2.4 0 L0.45 0.45 L0 2.4 L-0.45 0.45 L-2.4 0 L-0.45 -0.45 Z"
              fill="#e0e7ff"
              className="moldura-bruxa__star"
              style={s.style}
            />
          ) : (
            <circle r={s.r} fill="#e0e7ff" className="moldura-bruxa__star" style={s.style} />
          )}
        </g>
      ))}

      <g mask={`url(#${id}-behind)`}>
        <g className="moldura-bruxa__moon">
          <g transform="translate(0 -61)">
            <circle r="42" fill={`url(#${id}-moonlight)`} className="moldura-bruxa__glow" />
            <circle r="19" fill={`url(#${id}-moon)`} />
            {CRATERS.map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} fill="#d9a441" fillOpacity="0.22" />
            ))}
            <circle r="19" fill="none" stroke="#fff7d6" strokeWidth="0.6" strokeOpacity="0.8" />
          </g>
        </g>

        {CLOUDS.map((c, i) => (
          <g key={i} transform={`translate(0 ${c.y})`}>
            <g className="moldura-bruxa__cloud" style={c.style}>
              <g transform={`scale(${c.scale})`}>
                <path d={CLOUD} fill={`url(#${id}-cloud)`} />
                <path
                  d={CLOUD}
                  fill="none"
                  stroke="#c7d2fe"
                  strokeWidth="0.6"
                  strokeOpacity="0.45"
                  strokeDasharray="34 200"
                  strokeDashoffset="-6"
                />
              </g>
            </g>
          </g>
        ))}
      </g>

      {BATS.map((b, i) => (
        <g key={i} className="moldura-bruxa__bat" style={b.style}>
          <g transform={`scale(${b.size})`}>
            <g className="moldura-morcego__flutter">
              <Bat flap={b.flap} phase={b.phase} />
            </g>
          </g>
        </g>
      ))}

      {TRAIL.map((t, i) => (
        <g key={i} className="moldura-bruxa__flight" style={flight(t.lag)}>
          <g transform={`translate(0 ${-FLIGHT_RADIUS}) scale(0.9)`}>
            <g transform={`translate(${t.x} ${t.y})`}>
              <circle
                r={t.r * 2.2}
                fill={`url(#${id}-spark)`}
                opacity={t.opacity}
                className="moldura-fx__particula moldura-bruxa__spark"
                style={{ "--fall": t.fall } as CSSProperties}
              />
            </g>
          </g>
        </g>
      ))}

      <g className="moldura-bruxa__flight" style={flight()}>
        <g transform={`translate(0 ${-FLIGHT_RADIUS}) scale(0.9)`}>
          <g className="moldura-bruxa__bob">
            <path
              d="M-19 4.2 C-6 2.6 8 0.6 24 -1.6"
              fill="none"
              stroke="#3b2414"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            <g className="moldura-bruxa__bristles">
              <path
                d="M-18 2 C-22 0.4 -27 -1.4 -32 -1.6 L-30.4 0.8 L-33.6 1.6 L-31 3.6 L-34 5 L-30.6 6.4 L-32.6 9 C-27.6 8.6 -22.4 7.6 -18 6 Z"
                fill={`url(#${id}-straw)`}
                stroke="#2b1a06"
                strokeWidth="0.4"
              />
              <path
                d="M-18 3 L-30 0.6 M-18 3.6 L-31.4 3.4 M-18 4.4 L-31 6 M-18 5.2 L-29.6 8.2"
                fill="none"
                stroke="#2b1a06"
                strokeWidth="0.35"
                strokeOpacity="0.7"
              />
            </g>

            <path d="M-18.4 1.4 L-17.6 6.6" stroke="#a855f7" strokeWidth="1.6" />

            <g className="moldura-bruxa__rider">
              <g
                fill="none"
                stroke="#c4b5fd"
                strokeWidth="1.3"
                strokeOpacity="0.55"
                strokeLinejoin="round"
              >
                <WitchSilhouette />
              </g>

              <g fill="#170d2b">
                <WitchSilhouette />
              </g>

              <circle cx="6.2" cy="-12.4" r="2.5" fill="#5f8a45" />
              <path
                d="M8 -13.2 L11.4 -11.5 L8.2 -11 Z M6.4 -10.4 L7.8 -9 L5.6 -10.2 Z"
                fill="#5f8a45"
              />
              <circle cx="12" cy="-0.6" r="1" fill="#5f8a45" />
              <path
                d="M1 -16.7 C3.4 -17.5 6.2 -17.5 8.1 -16.9"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.2"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
