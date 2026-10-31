import type { ProfileGardenPalette } from "../../types/domain/profile/profile-garden-palette.js";
import type { ProfileGardenStyle } from "../../types/domain/profile/profile-garden-style.js";

/**
 * Species and colors of each garden style. Mid tones on purpose: they read on the light and the
 * dark surface of every theme, while the ground and the frame follow the theme tokens.
 */
export const PROFILE_GARDEN_STYLES: Readonly<Record<ProfileGardenStyle, ProfileGardenPalette>> = {
  // Generic backyard: a round fruit tree, marigolds and a vegetable bed with tomatoes.
  quintal: {
    tree: "broadleaf",
    flower: "daisy",
    backdrop: "fence",
    trunk: "#8a5a3c",
    leaf: "#4c9a4f",
    leafLight: "#7cc06a",
    blossom: null,
    bloomCrown: false,
    petals: ["#f2b632", "#ec8fb0"],
    center: "#9a5b2e",
    fruit: "#e0533d",
    grass: "#5fae55",
    wood: "#b98552",
    tuft: 1,
  },
  // Ipê amarelo in bloom, canela-de-ema flowers, buriti fruits and a buriti palm far behind.
  cerrado: {
    tree: "broadleaf",
    flower: "daisy",
    backdrop: "buriti",
    trunk: "#7b5236",
    leaf: "#6f9a3e",
    leafLight: "#9cbd5a",
    blossom: "#f0bd2c",
    bloomCrown: true,
    petals: ["#a77bd6", "#cf86d4"],
    center: "#f0bd2c",
    fruit: "#c2602e",
    grass: "#b3a548",
    wood: "#a77b4f",
    tuft: 1.15,
  },
  // Juçara palm, bromeliads, pitanga and the forest line behind.
  "mata-atlantica": {
    tree: "palm",
    flower: "bromeliad",
    backdrop: "treeline",
    trunk: "#7a6650",
    leaf: "#2f8a52",
    leafLight: "#57b06f",
    blossom: null,
    bloomCrown: false,
    petals: ["#e5484d", "#f07a3a"],
    center: "#f6c445",
    fruit: "#d9472b",
    grass: "#3f9a52",
    wood: "#8a6544",
    tuft: 1,
  },
  // Mandacaru with its white flower, xique-xique blooms, umbu and the rocks of the sertão.
  caatinga: {
    tree: "cactus",
    flower: "daisy",
    backdrop: "rocks",
    trunk: "#7b5c40",
    leaf: "#4f8f68",
    leafLight: "#86bd95",
    blossom: "#f4eee2",
    bloomCrown: false,
    petals: ["#e06aa8", "#f2a24a"],
    center: "#f6d36b",
    fruit: "#b9b23f",
    grass: "#9ea45a",
    wood: "#9c7a55",
    tuft: 0.8,
  },
  // Corticeira in red bloom, macela and verbena on the grassland, butiá and a wire fence.
  pampa: {
    tree: "broadleaf",
    flower: "daisy",
    backdrop: "wire",
    trunk: "#7a4f35",
    leaf: "#4f9a56",
    leafLight: "#7fbf6c",
    blossom: "#d9402f",
    bloomCrown: false,
    petals: ["#f2c14e", "#9b7bd4"],
    center: "#7a4f35",
    fruit: "#ee9b32",
    grass: "#6fae4f",
    wood: "#a0774f",
    tuft: 1.45,
  },
};

const GARDEN_ITEM_PREFIX = "garden-";

/**
 * The style of an equipped GARDEN item (`garden-cerrado` → `cerrado`). No item, or an id this
 * client does not know, falls back to the default backyard.
 */
export function gardenStyleOf(itemId: string | null | undefined): ProfileGardenStyle {
  const style = itemId?.startsWith(GARDEN_ITEM_PREFIX) && itemId.slice(GARDEN_ITEM_PREFIX.length);
  return style && style !== "quintal" && Object.hasOwn(PROFILE_GARDEN_STYLES, style)
    ? (style as ProfileGardenStyle)
    : "quintal";
}
