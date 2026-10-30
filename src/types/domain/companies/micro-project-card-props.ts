import type { MicroProjectActions } from "./micro-project-actions.js";
import type { MicroProjectCardData } from "./micro-project-card-data.js";
import type { MicroProjectViewer } from "./micro-project-viewer.js";

export type MicroProjectCardProps = {
  project: MicroProjectCardData;
  viewer: MicroProjectViewer;
  actions: MicroProjectActions;
};
