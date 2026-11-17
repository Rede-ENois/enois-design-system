import type { MuralAutor } from "./mural-autor.js";

/** O quadro do mural: título, descrição opcional, dono e quantas publicações já tem coladas. */
export type MuralResumo = {
  id: string;
  title: string;
  description: string | null;
  owner: MuralAutor;
  contributions: number;
  createdAt: string;
};
