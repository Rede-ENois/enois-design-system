/**
 * Garden stages of a profile, as the API sends them: each part grows 0..3, health is 0..2
 * (2 normal, 1 and 0 paint softer colors). Values out of range are clamped by the view.
 */
export type ProfileGardenData = {
  /** The main tree: trunk and branches grow by stage. */
  trajectory: number;
  /** The flowers. */
  relations: number;
  /** The raised bed and its fruits. */
  contribution: number;
  /** The grass and the richness of the ground. */
  tenure: number;
  health: number;
};
