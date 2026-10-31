/** Species and fixed natural colors of one garden style (the ground and frame use theme tokens). */
export type ProfileGardenPalette = {
  tree: "broadleaf" | "palm" | "cactus";
  flower: "daisy" | "bromeliad";
  backdrop: "fence" | "buriti" | "treeline" | "rocks" | "wire";
  trunk: string;
  leaf: string;
  leafLight: string;
  /** Blossoms of the grown tree (ipê, corticeira, mandacaru flower). */
  blossom: string | null;
  /** The grown tree's crown is all blossom (ipê amarelo). */
  bloomCrown: boolean;
  petals: readonly [string, string];
  center: string;
  fruit: string;
  grass: string;
  wood: string;
  /** Height of the grass tufts (tall pampa grass, short caatinga grass). */
  tuft: number;
};
