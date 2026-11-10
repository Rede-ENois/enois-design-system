import type { CSSProperties } from "react";

import { polar, round, seededRandom } from "../avatar-frames.js";

import { useFxId } from "./use-fx-id.js";

const rand = seededRandom(1408);

/** A lock of fur with its root at the origin, pointing up, the tip bent sideways by `curl`. */
function lock(length: number, width: number, curl: number): string {
  const [l, w] = [length, width];
  return `M${-w} 0 C${round(-w * 0.9)} ${round(-l * 0.45)} ${round(curl * 0.5 - w * 0.4)} ${round(-l * 0.8)} ${round(curl)} ${round(-l)} C${round(curl * 0.45 + w * 0.2)} ${round(-l * 0.72)} ${round(w * 0.95)} ${round(-l * 0.4)} ${w} 0 Z`;
}

/** Fur falls like a mane: down the right side clockwise, down the left side counterclockwise. */
function fall(angle: number, amount: number): number {
  return round(Math.sin((angle * Math.PI) / 180) * amount);
}

function locks(
  count: number,
  radius: number,
  length: [number, number],
  width: [number, number],
  skip = 0,
) {
  return Array.from({ length: count }, (_, i) => {
    const angle = round((i * 360) / count + skip + (rand() - 0.5) * (240 / count));
    const side = Math.abs(Math.sin((angle * Math.PI) / 180));
    const l = (length[0] + rand() * (length[1] - length[0])) * (0.5 + 0.5 * side);
    return {
      transform: `rotate(${angle}) translate(0 ${-radius})`,
      d: lock(l, width[0] + rand() * (width[1] - width[0]), fall(angle, l * (0.35 + rand() * 0.3))),
    };
  });
}

/** The soft mass under the locks: a ring with a ragged outer edge. */
const UNDERFUR = (() => {
  let d = "";
  for (let i = 0; i < 180; i++) {
    const angle = i * 2;
    const r =
      59 +
      2.4 * Math.sin((angle * 7 * Math.PI) / 180) +
      1.6 * Math.sin((angle * 19 * Math.PI) / 180 + 1) +
      (rand() - 0.5) * 3;
    d += `${i ? "L" : "M"}${polar(round(r), angle).join(" ")} `;
  }
  return `${d}Z`;
})();

/** Fine hairs drawn over the mass, so it reads as fur and not as a blur. */
function strands(count: number, from: number, length: [number, number]): string {
  return Array.from({ length: count }, () => {
    const angle = rand() * 360;
    const l = length[0] + rand() * (length[1] - length[0]);
    const [x1, y1] = polar(from + rand() * 4, angle);
    const [cx, cy] = polar(from + l * 0.6, angle + fall(angle, 3));
    const [x2, y2] = polar(from + l, angle + fall(angle, 7 + rand() * 4));
    return `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;
  }).join(" ");
}

const BACK_LOCKS = locks(40, 47, [17, 27], [3, 4.4]);
const MID_LOCKS = locks(34, 49, [10, 16], [2.4, 3.4], 5.3);
const DARK_STRANDS = strands(110, 49, [8, 18]);
const LIGHT_STRANDS = strands(70, 51, [6, 13]);

/** Short locks over the lower edge of the portrait, pointing inwards like a ruff. */
const RUFF = Array.from({ length: 22 }, (_, i) => {
  const angle = round(110 + i * 6.6 + (rand() - 0.5) * 3);
  return {
    angle,
    d: lock(6 + rand() * 4, 1.4 + rand() * 0.7, fall(angle, -3 - rand() * 2)),
  };
});

const EARS = [-27, 27];
const PAWS = [212, 148];

/** A finger with its root at the origin, pointing at the portrait (+y), with a hooked claw. */
function finger(length: number, base: number, tip: number) {
  const [l, b, t] = [length, base / 2, tip / 2];
  return {
    skin: `M${-b} 0 C${-b} ${round(l * 0.5)} ${-t} ${round(l * 0.82)} ${round(-t + 0.2)} ${l} Q0 ${round(l + 1.1)} ${round(t - 0.2)} ${l} C${t} ${round(l * 0.82)} ${b} ${round(l * 0.5)} ${b} 0 Z`,
    creases: `M${round(-b * 0.8)} ${round(l * 0.4)} Q0 ${round(l * 0.4 + 0.8)} ${round(b * 0.8)} ${round(l * 0.4)} M${round(-t * 0.9)} ${round(l * 0.74)} Q0 ${round(l * 0.74 + 0.7)} ${round(t * 0.9)} ${round(l * 0.74)}`,
    claw: `M${round(-t * 0.85)} ${round(l - 0.8)} C${round(-t * 0.9)} ${round(l + 3)} ${round(-t * 0.2)} ${round(l + 5.8)} 0.9 ${round(l + 7.6)} C${round(t * 0.7)} ${round(l + 5)} ${round(t * 0.95)} ${round(l + 2.4)} ${round(t * 0.85)} ${round(l - 0.8)} Z`,
  };
}

/** Four fingers fanned over the edge of the photo and a thumb on the side, claws first. */
const FINGERS = [
  { x: -6.3, turn: 13, ...finger(10, 3.7, 2.7) },
  { x: -2.1, turn: 4, ...finger(12, 3.9, 2.8) },
  { x: 2.1, turn: -4, ...finger(11.4, 3.9, 2.8) },
  { x: 6.3, turn: -13, ...finger(9.2, 3.6, 2.6) },
  { x: -9.4, y: -4, turn: 38, ...finger(7.6, 3.6, 2.6) },
].map((f, i) => ({
  ...f,
  transform: `translate(${f.x} ${"y" in f ? f.y : 0.4}) rotate(${f.turn})`,
  style: { animationDelay: `${round(-i * 0.21)}s` },
}));

/** Shaggy fur on the forearm and the back of the hand, combed toward the fingers. */
const FOREARM_FUR = [-1, 1].flatMap((side) =>
  Array.from({ length: 6 }, (_, i) => ({
    transform: `translate(${round(side * (7.8 + i * 0.45))} ${round(-23 + i * 3.4)}) rotate(${side * (146 + rand() * 16)})`,
    d: lock(4.5 + rand() * 3, 1.4 + rand() * 0.5, round(side * (0.5 + rand()))),
  })),
);
const FOREARM_LOCKS = Array.from({ length: 26 }, (_, i) => {
  const y = -25 + (i / 25) * 21 + (rand() - 0.5) * 2;
  const half = 7.4 + ((y + 24) / 22) * 2.6;
  return {
    transform: `translate(${round((rand() - 0.5) * 2 * (half - 1.6))} ${round(y)}) rotate(${round(180 + (rand() - 0.5) * 24)})`,
    d: lock(6.5 + rand() * 4, 0.9 + rand() * 0.5, round((rand() - 0.5) * 3)),
    light: i % 3 === 0,
  };
});

const STARS = Array.from({ length: 14 }, () => {
  const [x, y] = polar(56 + rand() * 20, rand() * 360);
  return {
    x,
    y,
    r: round(0.35 + rand() * 0.5),
    style: {
      animationDuration: `${round(1.8 + rand() * 2.2)}s`,
      animationDelay: `${round(-rand() * 4)}s`,
    },
  };
});

const SCRATCHES = [0, 1, 2].map((i) => {
  const [x1, y1] = polar(70 - i * 1.5, 112 + i * 9);
  const [x2, y2] = polar(48 + i * 1.5, 140 + i * 9);
  return `M${x1} ${y1} Q${round((x1 + x2) / 2 + 4)} ${round((y1 + y2) / 2 + 2)} ${x2} ${y2}`;
});

function Ear({ id }: { id: string }) {
  return (
    <>
      <path
        d="M-12 2 C-11 -9 -7 -21 -1.4 -32 C-0.4 -33.6 0.8 -33.6 1.6 -32 C6.6 -21 10.6 -9 12 2 L9 0.6 L10.6 -2.6 L7.4 -2 L7.6 -5.4 L-7.6 -5.4 L-7.4 -2 L-10.6 -2.6 L-9 0.6 Z"
        fill={`url(#${id}-ear)`}
        stroke="#120e0b"
        strokeWidth="0.6"
      />
      <path
        d="M-6.6 -2 C-5.8 -10 -3.4 -18.6 0 -26.6 C3.2 -18.6 5.6 -10 6.4 -2 Z"
        fill={`url(#${id}-inner)`}
      />
      <path
        d="M-5.4 -3 L-2.6 -11 M-3.4 -2 L-0.6 -13.4 M5.2 -3 L2.4 -11 M3 -2 L0.6 -13"
        stroke="#c9b49a"
        strokeWidth="0.7"
        strokeLinecap="round"
      />
      <path
        d="M-11.4 -6 L-13.4 -8.6 L-10.6 -9.4 M-9.6 -14 L-11.4 -17 L-8.4 -17.4 M9.8 -10 L12 -12.6 L9.2 -13.6"
        fill="none"
        stroke="#2e261f"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </>
  );
}

function Paw({ id }: { id: string }) {
  return (
    <>
      {FOREARM_FUR.map((f, i) => (
        <path key={i} d={f.d} transform={f.transform} fill={`url(#${id}-paw)`} />
      ))}
      <path
        d="M-7.6 -25 C-8.6 -18 -9.6 -12 -10.4 -7 C-11 -3.6 -10.4 -0.6 -8.6 1.6 L8.6 1.6 C10.4 -0.6 11 -3.6 10.4 -7 C9.6 -12 8.6 -18 7.6 -25 Z"
        fill={`url(#${id}-arm)`}
        stroke="#120e0b"
        strokeWidth="0.45"
      />
      {FOREARM_LOCKS.map((f, i) => (
        <path
          key={i}
          d={f.d}
          transform={f.transform}
          fill={`url(#${id}-${f.light ? "light" : "dark"})`}
        />
      ))}
      {FINGERS.map((f, i) => (
        <g key={i} transform={f.transform}>
          <g className="moldura-uivo__finger" style={f.style}>
            <path d={f.skin} fill={`url(#${id}-skin)`} stroke="#0d0907" strokeWidth="0.45" />
            <path
              d={f.creases}
              fill="none"
              stroke="#0d0907"
              strokeWidth="0.4"
              strokeOpacity="0.8"
            />
            <ellipse cy="0.6" rx="1.7" ry="1.2" fill="#6b584b" fillOpacity="0.55" />
            <path
              d={f.claw}
              fill={`url(#${id}-claw)`}
              stroke="#1c1712"
              strokeWidth="0.35"
              className="moldura-uivo__claw"
            />
          </g>
        </g>
      ))}
    </>
  );
}

/**
 * Werewolf: a transformation on loop. The full moon rises between the ears from behind the
 * portrait, fur bursts out around it in spasms, wolf ears grow, the paws grab the edge of the
 * photo; it howls, scratches the frame and then turns back until the moon rises again.
 */
export function UivoFx() {
  const id = useFxId();
  return (
    <svg viewBox="-80 -80 160 160" className="moldura-fx__svg">
      <defs>
        <radialGradient id={`${id}-night`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="80">
          <stop offset="0.6" stopColor="#0b1120" stopOpacity="0.92" />
          <stop offset="0.82" stopColor="#1e293b" stopOpacity="0.5" />
          <stop offset="1" stopColor="#1e293b" stopOpacity="0" />
        </radialGradient>

        <radialGradient id={`${id}-moon`} cx="0.4" cy="0.36">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#94a3b8" />
        </radialGradient>

        <radialGradient id={`${id}-moonlight`}>
          <stop offset="0.35" stopColor="#e0f2fe" stopOpacity="0.5" />
          <stop offset="1" stopColor="#93c5fd" stopOpacity="0" />
        </radialGradient>

        <linearGradient id={`${id}-dark`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1a1410" />
          <stop offset="0.6" stopColor="#3d3228" />
          <stop offset="1" stopColor="#6e5c4a" />
        </linearGradient>

        <linearGradient id={`${id}-light`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3a2f26" />
          <stop offset="0.55" stopColor="#7a6550" />
          <stop offset="1" stopColor="#bba387" />
        </linearGradient>

        <linearGradient id={`${id}-ear`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#2a221b" />
          <stop offset="0.7" stopColor="#4d4034" />
          <stop offset="1" stopColor="#7d6a56" />
        </linearGradient>

        <linearGradient id={`${id}-inner`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3b2621" />
          <stop offset="1" stopColor="#9a6b60" />
        </linearGradient>

        <linearGradient id={`${id}-paw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2f26" />
          <stop offset="0.6" stopColor="#6e5c4a" />
          <stop offset="1" stopColor="#8f7a64" />
        </linearGradient>

        <linearGradient id={`${id}-arm`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f1813" />
          <stop offset="0.32" stopColor="#5a4a3b" />
          <stop offset="0.7" stopColor="#362b22" />
          <stop offset="1" stopColor="#15100c" />
        </linearGradient>

        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6a574a" />
          <stop offset="0.45" stopColor="#43362d" />
          <stop offset="1" stopColor="#211915" />
        </linearGradient>

        <radialGradient id={`${id}-underfur`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="64">
          <stop offset="0.74" stopColor="#14100c" />
          <stop offset="0.88" stopColor="#3d3228" />
          <stop offset="1" stopColor="#6b5947" />
        </radialGradient>

        <linearGradient id={`${id}-claw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b241d" />
          <stop offset="0.35" stopColor="#8f846f" />
          <stop offset="0.75" stopColor="#e3dccb" />
          <stop offset="1" stopColor="#fbf7ec" />
        </linearGradient>

        <linearGradient id={`${id}-reach`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.32" stopColor="#fff" />
        </linearGradient>

        <mask id={`${id}-arm-fade`} maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill={`url(#${id}-reach)`} />
        </mask>

        <mask
          id={`${id}-behind`}
          maskUnits="userSpaceOnUse"
          x="-110"
          y="-110"
          width="220"
          height="220"
        >
          <rect x="-110" y="-110" width="220" height="220" fill="#fff" />
          <circle r="49.4" fill="#000" />
        </mask>
      </defs>

      <circle r="80" fill={`url(#${id}-night)`} mask={`url(#${id}-behind)`} />
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#e2e8f0"
          className="moldura-bruxa__star"
          style={s.style}
        />
      ))}

      <g mask={`url(#${id}-behind)`}>
        <g className="moldura-uivo__moon">
          <g transform="translate(0 -63)">
            <circle r="32" fill={`url(#${id}-moonlight)`} />
            <circle r="15" fill={`url(#${id}-moon)`} />
            <circle cx="-4" cy="-3" r="3.4" fill="#94a3b8" fillOpacity="0.3" />
            <circle cx="5" cy="4" r="2.4" fill="#94a3b8" fillOpacity="0.3" />
            <circle cx="3" cy="-7" r="1.6" fill="#94a3b8" fillOpacity="0.3" />
          </g>
        </g>

        <g className="moldura-uivo__howl" fill="none" stroke="#e2e8f0" strokeLinecap="round">
          {[0, 1, 2].map((i) => {
            const [x1, y1] = polar(53, -16);
            const [x2, y2] = polar(53, 16);
            return (
              <path
                key={i}
                d={`M${x1} ${y1} A53 53 0 0 1 ${x2} ${y2}`}
                strokeWidth="1.4"
                className="moldura-fx__particula moldura-uivo__wave"
                style={{ animationDelay: `${round(i * 0.35)}s` }}
              />
            );
          })}
        </g>

        {EARS.map((angle) => (
          <g key={angle} transform={`rotate(${angle}) translate(0 -46) scale(1.12)`}>
            <g
              className="moldura-uivo__ear"
              style={{ "--side": Math.sign(angle) } as CSSProperties}
            >
              <Ear id={id} />
            </g>
          </g>
        ))}

        <g className="moldura-uivo__grow moldura-uivo__grow--back">
          <g className="moldura-uivo__sway">
            {BACK_LOCKS.map((f, i) => (
              <path key={i} d={f.d} transform={f.transform} fill={`url(#${id}-dark)`} />
            ))}
          </g>

          <path d={UNDERFUR} fill={`url(#${id}-underfur)`} />
          <path
            d={DARK_STRANDS}
            fill="none"
            stroke="#0f0c09"
            strokeWidth="0.45"
            strokeOpacity="0.7"
          />
        </g>

        <g className="moldura-uivo__grow moldura-uivo__grow--mid">
          <g className="moldura-uivo__sway moldura-uivo__sway--back">
            {MID_LOCKS.map((f, i) => (
              <path key={i} d={f.d} transform={f.transform} fill={`url(#${id}-light)`} />
            ))}
          </g>

          <path
            d={LIGHT_STRANDS}
            fill="none"
            stroke="#c9b49a"
            strokeWidth="0.4"
            strokeOpacity="0.4"
          />
        </g>
      </g>

      {RUFF.map((r, i) => (
        <g key={i} transform={`rotate(${r.angle}) translate(0 -54.5) rotate(180)`}>
          <path d={r.d} fill={`url(#${id}-light)`} className="moldura-uivo__ruff" />
        </g>
      ))}

      <g fill="none" strokeLinecap="round">
        {SCRATCHES.map((d, i) => (
          <g
            key={i}
            className="moldura-fx__particula moldura-uivo__scratch"
            style={{ animationDelay: `${round(i * 0.06)}s` }}
          >
            <path d={d} stroke="#450a0a" strokeWidth="2.6" />
            <path d={d} stroke="#fecaca" strokeWidth="0.9" />
          </g>
        ))}
      </g>

      {PAWS.map((angle) => (
        <g key={angle} transform={`rotate(${angle}) translate(0 -59)`}>
          <g className={`moldura-uivo__paw${angle === 148 ? " moldura-uivo__paw--swipe" : ""}`}>
            <g transform={angle === 148 ? "scale(-1 1)" : undefined} mask={`url(#${id}-arm-fade)`}>
              <Paw id={id} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}
