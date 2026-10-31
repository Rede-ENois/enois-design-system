import type { ReactNode } from "react";

import type { ProfileGardenData } from "../../types/domain/profile/profile-garden-data.js";
import type { ProfileGardenPalette } from "../../types/domain/profile/profile-garden-palette.js";

/*
 * Static drawing of the profile garden in a 240x132 box (the view shows y 12..124), ground at
 * y=104. Four parts at fixed spots (tree on the left, flowers in the middle, raised bed on the
 * right, grass all along), each drawn by stage 0..3. Stage 0 is a prepared garden (soil, seeds and sprouts), never a bare one.
 */

const GROUND = 104;
const TREE_X = 70;

/** A leaf pointing up from (0,0), placed by the transform. */
function Leaf({
  x,
  y,
  angle,
  length,
  width,
  fill,
}: {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  fill: string;
}) {
  const half = length / 2;
  return (
    <path
      d={`M0 0Q${width} ${-half} 0 ${-length}Q${-width} ${-half} 0 0Z`}
      transform={`translate(${x} ${y}) rotate(${angle})`}
      fill={fill}
    />
  );
}

function Sprout({
  x,
  y,
  scale,
  palette,
}: {
  x: number;
  y: number;
  scale: number;
  palette: ProfileGardenPalette;
}) {
  const top = y - 8 * scale;
  return (
    <g>
      <path
        d={`M${x} ${y}V${top}`}
        stroke={palette.leaf}
        strokeWidth={1.6 * scale}
        strokeLinecap="round"
      />
      <Leaf
        x={x}
        y={top + 1}
        angle={-58}
        length={8 * scale}
        width={3 * scale}
        fill={palette.leafLight}
      />
      <Leaf x={x} y={top + 1} angle={58} length={8 * scale} width={3 * scale} fill={palette.leaf} />
    </g>
  );
}

function Backdrop({ palette }: { palette: ProfileGardenPalette }) {
  switch (palette.backdrop) {
    case "fence":
      return (
        <g fill={palette.wood} opacity={0.45}>
          <rect x={0} y={88} width={240} height={2.5} />
          <rect x={0} y={96} width={240} height={2.5} />
          {Array.from({ length: 18 }, (_, i) => (
            <path key={i} d={`M${6 + i * 13.5} ${GROUND}V84l2.5-3l2.5 3V${GROUND}Z`} />
          ))}
        </g>
      );
    case "buriti":
      return (
        <g opacity={0.5}>
          <path d="M26 104Q24 80 27 56" stroke={palette.trunk} strokeWidth={3} fill="none" />
          {[-150, -120, -90, -60, -30, -170, -10].map((angle) => (
            <Leaf
              key={angle}
              x={27}
              y={57}
              angle={angle + 90}
              length={20}
              width={4}
              fill={palette.leaf}
            />
          ))}
        </g>
      );
    case "treeline":
      return (
        <g fill={palette.leaf} opacity={0.28}>
          {[
            [10, 92, 14],
            [30, 88, 16],
            [196, 90, 15],
            [216, 86, 18],
            [236, 92, 14],
          ].map(([cx, cy, r]) => (
            <circle key={cx} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );
    case "rocks":
      return (
        <g fill="#a3968a" opacity={0.6}>
          <path d="M8 104Q10 90 24 88Q38 88 40 104Z" />
          <path d="M212 104Q214 94 224 93Q234 94 236 104Z" />
        </g>
      );
    case "wire":
      return (
        <g opacity={0.5} stroke={palette.wood}>
          <path d="M0 88H240M0 95H240" strokeWidth={0.8} />
          {[16, 64, 172, 220].map((x) => (
            <path key={x} d={`M${x} ${GROUND}V82`} strokeWidth={2.4} strokeLinecap="round" />
          ))}
        </g>
      );
  }
}

const TUFTS = [10, 236, 104, 34, 166, 52, 222, 114, 92, 140, 4, 206, 22, 64, 128, 232];

function Ground({ stage, palette }: { stage: number; palette: ProfileGardenPalette }) {
  const tufts = [0, 5, 10, 16][stage];
  const band = [0, 2.5, 4, 5.5][stage];
  const h = 9 * palette.tuft * (0.8 + stage * 0.1);
  return (
    <g>
      <path d="M0 104Q60 99 120 102T240 101V132H0Z" className="profile-garden__soil" />
      {stage === 0 &&
        [24, 48, 120, 150, 230].map((x) => (
          <path
            key={x}
            d={`M${x - 5} ${GROUND + 8}h10`}
            className="profile-garden__furrow"
            strokeLinecap="round"
          />
        ))}
      {band > 0 && (
        <path
          d={`M0 ${104 - band / 2}Q60 ${99 - band / 2} 120 ${102 - band / 2}T240 ${101 - band / 2}V${101 + band / 2}Q180 ${104 + band / 2} 120 ${102 + band / 2}T0 ${104 + band / 2}Z`}
          fill={palette.grass}
        />
      )}
      <g stroke={palette.grass} strokeWidth={1.4} strokeLinecap="round" fill="none">
        {TUFTS.slice(0, tufts).map((x) => (
          <path
            key={x}
            d={`M${x} ${GROUND}q-2 ${-h * 0.6} -4 ${-h * 0.9}M${x} ${GROUND}v${-h}M${x} ${GROUND}q2 ${-h * 0.6} 4 ${-h * 0.9}`}
          />
        ))}
      </g>
      {stage === 3 &&
        [28, 98, 208].map((x, i) => (
          <circle key={x} cx={x} cy={GROUND - 2} r={1.6} fill={palette.petals[i % 2]} />
        ))}
    </g>
  );
}

function BroadleafTree({ stage, palette }: { stage: number; palette: ProfileGardenPalette }) {
  const x = TREE_X;
  if (stage === 1) {
    return (
      <g>
        <path
          d={`M${x} ${GROUND}C${x} 94 ${x + 1} 86 ${x} 76`}
          stroke={palette.trunk}
          strokeWidth={2.4}
          fill="none"
          strokeLinecap="round"
        />
        <Leaf x={x} y={92} angle={-60} length={11} width={4} fill={palette.leaf} />
        <Leaf x={x} y={86} angle={58} length={12} width={4.5} fill={palette.leafLight} />
        <Leaf x={x} y={80} angle={-40} length={11} width={4} fill={palette.leafLight} />
        <Leaf x={x} y={77} angle={20} length={12} width={4.5} fill={palette.leaf} />
      </g>
    );
  }
  const grown = stage === 3;
  const crown = grown && palette.bloomCrown ? (palette.blossom ?? palette.leaf) : palette.leaf;
  const shine = grown && palette.bloomCrown ? "#f6d878" : palette.leafLight;
  const blobs: [number, number, number][] = grown
    ? [
        [x - 22, 58, 15],
        [x + 23, 54, 16],
        [x, 42, 22],
        [x - 12, 34, 13],
        [x + 13, 32, 13],
      ]
    : [
        [x - 15, 68, 11],
        [x + 16, 66, 12],
        [x, 56, 16],
      ];
  const blooms: [number, number][] = grown
    ? [
        [x - 24, 54],
        [x - 8, 30],
        [x + 10, 40],
        [x + 26, 50],
        [x - 14, 46],
        [x + 18, 28],
        [x + 2, 24],
        [x - 30, 62],
        [x + 32, 60],
      ]
    : [
        [x - 12, 64],
        [x + 8, 52],
        [x + 18, 66],
      ];
  const showBlooms = palette.blossom && !(grown && palette.bloomCrown);
  return (
    <g>
      <path
        d={
          grown
            ? `M${x - 5} ${GROUND}C${x - 4} 86 ${x - 2} 70 ${x - 2} 52H${x + 2}C${x + 2} 70 ${x + 4} 86 ${x + 5} ${GROUND}Z`
            : `M${x - 3} ${GROUND}C${x - 2} 90 ${x - 1} 78 ${x - 1} 62H${x + 1}C${x + 1} 78 ${x + 2} 90 ${x + 3} ${GROUND}Z`
        }
        fill={palette.trunk}
      />
      <path
        d={
          grown
            ? `M${x - 1} 74L${x - 20} 58M${x + 1} 68L${x + 22} 54`
            : `M${x} 78L${x - 14} 68M${x} 74L${x + 15} 66`
        }
        stroke={palette.trunk}
        strokeWidth={grown ? 2.6 : 1.8}
        strokeLinecap="round"
      />
      {blobs.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={crown} />
      ))}
      {blobs.map(([cx, cy, r]) => (
        <circle
          key={`s${cx}-${cy}`}
          cx={cx - r * 0.3}
          cy={cy - r * 0.35}
          r={r * 0.45}
          fill={shine}
          opacity={0.55}
        />
      ))}
      {grown &&
        palette.bloomCrown &&
        [
          [x - 18, 62],
          [x + 20, 60],
          [x + 4, 48],
        ].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r={2.4} fill={palette.leaf} />)}
      {showBlooms &&
        blooms.map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={grown ? 2.6 : 2}
            fill={palette.blossom ?? undefined}
          />
        ))}
    </g>
  );
}

function PalmTree({
  stage,
  palette,
  x = TREE_X,
}: {
  stage: number;
  palette: ProfileGardenPalette;
  x?: number;
}) {
  const height = [0, 18, 46, 64][stage];
  const fronds = [0, 3, 5, 7][stage];
  const length = [0, 12, 22, 30][stage];
  const top = GROUND - height;
  const angles = [-75, 75, -40, 40, -105, 105, 0].slice(0, fronds);
  return (
    <g>
      <path
        d={`M${x} ${GROUND}Q${x + 4} ${GROUND - height / 2} ${x + 1} ${top}`}
        stroke={palette.trunk}
        strokeWidth={stage === 1 ? 2 : stage === 2 ? 3.4 : 4.4}
        strokeLinecap="round"
        fill="none"
      />
      {angles.map((angle, i) => (
        <Leaf
          key={angle}
          x={x + 1}
          y={top}
          angle={angle}
          length={length}
          width={length / 5}
          fill={i % 2 ? palette.leafLight : palette.leaf}
        />
      ))}
      {stage === 3 && (
        <g fill="#5b2f5e">
          <circle cx={x - 2} cy={top + 6} r={1.8} />
          <circle cx={x + 2} cy={top + 7} r={1.8} />
          <circle cx={x} cy={top + 9} r={1.8} />
        </g>
      )}
    </g>
  );
}

function Cactus({ stage, palette }: { stage: number; palette: ProfileGardenPalette }) {
  const x = TREE_X;
  const height = [0, 22, 46, 62][stage];
  const width = [0, 8, 10, 12][stage];
  const top = GROUND - height;
  const arm = (d: string) => (
    <path
      d={d}
      stroke={palette.leaf}
      strokeWidth={width * 0.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
  return (
    <g>
      {stage >= 2 && arm(`M${x} ${GROUND - 20}h10q3 0 3 -4v-${stage === 3 ? 22 : 14}`)}
      {stage === 3 && arm(`M${x} ${GROUND - 30}h-11q-3 0 -3 -4v-14`)}
      <rect
        x={x - width / 2}
        y={top}
        width={width}
        height={height + 1}
        rx={width / 2}
        fill={palette.leaf}
      />
      <path
        d={`M${x - width / 5} ${top + 4}V${GROUND - 2}M${x + width / 5} ${top + 4}V${GROUND - 2}`}
        stroke={palette.leafLight}
        strokeWidth={0.9}
        strokeLinecap="round"
      />
      {stage === 3 && palette.blossom && (
        <g>
          <circle cx={x} cy={top - 1} r={4.4} fill={palette.blossom} />
          <circle cx={x} cy={top - 1} r={1.8} fill={palette.center} />
        </g>
      )}
    </g>
  );
}

function Tree({ stage, palette }: { stage: number; palette: ProfileGardenPalette }) {
  if (stage === 0) {
    return (
      <g>
        <ellipse cx={TREE_X} cy={GROUND} rx={13} ry={3.5} className="profile-garden__furrow-fill" />
        <ellipse cx={TREE_X - 3} cy={GROUND - 1} rx={1.8} ry={1.2} fill={palette.trunk} />
        <Sprout x={TREE_X} y={GROUND - 1} scale={1.4} palette={palette} />
      </g>
    );
  }
  if (palette.tree === "palm") return <PalmTree stage={stage} palette={palette} />;
  if (palette.tree === "cactus") return <Cactus stage={stage} palette={palette} />;
  return <BroadleafTree stage={stage} palette={palette} />;
}

const FLOWER_SPOTS: [number, number, number][] = [
  [118, 105, 15],
  [144, 104, 17],
  [131, 108, 11],
  [157, 108, 13],
  [124, 113, 8],
  [151, 114, 9],
];

function Flower({
  x,
  y,
  height,
  color,
  palette,
}: {
  x: number;
  y: number;
  height: number;
  color: string;
  palette: ProfileGardenPalette;
}) {
  const top = y - height;
  if (palette.flower === "bromeliad") {
    return (
      <g>
        {[-50, -25, 0, 25, 50].map((angle, i) => (
          <Leaf
            key={angle}
            x={x}
            y={y}
            angle={angle}
            length={height * 0.8}
            width={2.4}
            fill={i % 2 ? palette.leafLight : palette.leaf}
          />
        ))}
        {[-14, 0, 14].map((angle) => (
          <Leaf
            key={angle}
            x={x}
            y={y - height * 0.45}
            angle={angle}
            length={height * 0.55}
            width={2}
            fill={color}
          />
        ))}
      </g>
    );
  }
  return (
    <g>
      <path d={`M${x} ${y}V${top}`} stroke={palette.leaf} strokeWidth={1.2} strokeLinecap="round" />
      <Leaf x={x} y={y - height * 0.35} angle={50} length={6} width={2.4} fill={palette.leaf} />
      {[0, 72, 144, 216, 288].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <circle
            key={angle}
            cx={x + Math.sin(rad) * 2.9}
            cy={top - Math.cos(rad) * 2.9}
            r={2.3}
            fill={color}
          />
        );
      })}
      <circle cx={x} cy={top} r={1.7} fill={palette.center} />
    </g>
  );
}

function Bud({
  x,
  y,
  height,
  color,
  palette,
}: {
  x: number;
  y: number;
  height: number;
  color: string;
  palette: ProfileGardenPalette;
}) {
  const top = y - height * 0.6;
  if (palette.flower === "bromeliad") {
    return (
      <g>
        {[-35, 0, 35].map((angle) => (
          <Leaf
            key={angle}
            x={x}
            y={y}
            angle={angle}
            length={height * 0.6}
            width={2}
            fill={palette.leaf}
          />
        ))}
      </g>
    );
  }
  return (
    <g>
      <path d={`M${x} ${y}V${top}`} stroke={palette.leaf} strokeWidth={1.2} strokeLinecap="round" />
      <ellipse cx={x} cy={top - 2} rx={1.8} ry={2.8} fill={palette.leafLight} />
      <circle cx={x} cy={top - 4.2} r={1} fill={color} />
    </g>
  );
}

function Flowers({ stage, palette }: { stage: number; palette: ProfileGardenPalette }) {
  const open = [0, 2, 4, 6][stage];
  const buds = [3, 2, 1, 0][stage];
  const spots: ReactNode[] = [];
  FLOWER_SPOTS.slice(0, open + buds).forEach(([x, y, height], i) => {
    const color = palette.petals[i % 2];
    spots.push(
      i < open ? (
        <Flower key={i} x={x} y={y} height={height} color={color} palette={palette} />
      ) : (
        <Bud key={i} x={x} y={y} height={height} color={color} palette={palette} />
      ),
    );
  });
  return <g>{spots}</g>;
}

const BED_PLANTS = [187, 203, 219];

function Bed({ stage, palette }: { stage: number; palette: ProfileGardenPalette }) {
  const top = 99;
  return (
    <g>
      <rect x={174} y={top} width={58} height={4} rx={2} className="profile-garden__furrow-fill" />
      <rect x={174} y={top + 3} width={58} height={10} rx={2} fill={palette.wood} />
      <path d={`M174 ${top + 8}H232`} stroke="#000" strokeOpacity={0.12} strokeWidth={0.8} />
      {BED_PLANTS.map((x, i) => {
        if (stage === 0) {
          return <ellipse key={x} cx={x} cy={top + 1} rx={1.8} ry={1.2} fill={palette.trunk} />;
        }
        if (stage === 1) return <Sprout key={x} x={x} y={top + 1} scale={1} palette={palette} />;
        const r = stage === 2 ? 6 : 8;
        const fruits: [number, number][] =
          stage === 2
            ? [
                [x - 2, top - r + 1],
                [x + 3, top - r - 3],
              ]
            : [
                [x - 4, top - r],
                [x + 3, top - r - 5],
                [x + 4, top - r + 2],
                [x - 1, top - r * 2 + 3],
              ];
        return (
          <g key={x}>
            <circle cx={x} cy={top - r + 1} r={r} fill={i % 2 ? palette.leafLight : palette.leaf} />
            <circle
              cx={x - r * 0.3}
              cy={top - r * 1.3 + 1}
              r={r * 0.4}
              fill={palette.leafLight}
              opacity={0.5}
            />
            {fruits.map(([cx, cy]) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={stage === 2 ? 1.9 : 2.2}
                fill={palette.fruit}
              />
            ))}
          </g>
        );
      })}
      {stage === 0 && (
        <path
          d={`M228 ${top + 1}V${top - 9}`}
          stroke={palette.wood}
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      )}
      {stage === 0 && <rect x={224} y={top - 13} width={8} height={5} rx={1} fill={palette.wood} />}
    </g>
  );
}

/** The garden drawing, parts already clamped to their ranges. */
export function ProfileGardenArt({
  garden,
  palette,
}: {
  garden: Omit<ProfileGardenData, "health">;
  palette: ProfileGardenPalette;
}) {
  return (
    <g>
      <circle cx={208} cy={28} r={12} className="profile-garden__sun" />
      {garden.tenure >= 2 && <Backdrop palette={palette} />}
      <Ground stage={garden.tenure} palette={palette} />
      <Tree stage={garden.trajectory} palette={palette} />
      <Bed stage={garden.contribution} palette={palette} />
      <Flowers stage={garden.relations} palette={palette} />
    </g>
  );
}
