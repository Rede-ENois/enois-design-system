// Drawn frame by frame by scripts/avatar-frames/lacraia (procedural legs and ink), not by CSS.
const crawl = new URL("../../../assets/avatar-frames/lacraia/crawl.webp", import.meta.url).href;
const still = new URL("../../../assets/avatar-frames/lacraia/still.webp", import.meta.url).href;

const IMAGE_PROPS = {
  alt: "",
  width: 460,
  height: 460,
  draggable: false,
  loading: "lazy",
  decoding: "async",
} as const;

/**
 * Lacraia: an ink centipede with a skull mask crawls out from behind the portrait, walks the rim
 * leg by leg, rears up and snaps at the top, and sinks back behind the photo. The loop is an
 * animated WebP; a still frame stands in whenever the avatar must not move.
 */
export function LacraiaFx() {
  return (
    <span className="moldura-lacraia">
      <img {...IMAGE_PROPS} src={still} className="moldura-lacraia__still" />
      <img {...IMAGE_PROPS} src={crawl} className="moldura-lacraia__crawl" />
    </span>
  );
}
