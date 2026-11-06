import type { ComponentType } from "react";

import type { AvatarFrameFxProps } from "../../types/domain/avatar/avatar-frame-fx-props.js";

import { SEASONAL_FX_FRAMES } from "./avatar-frames.js";
import { BruxaFx } from "./frames/bruxa.js";
import { BuracoNegroFx } from "./frames/buraco-negro.js";
import { CaixaoFx } from "./frames/caixao.js";
import { CircuitoFx } from "./frames/circuito.js";
import { FliperamaFx } from "./frames/fliperama.js";
import { GalaxiaFx } from "./frames/galaxia.js";
import { GlacialFx } from "./frames/glacial.js";
import { HologramaFx } from "./frames/holograma.js";
import { InfernoFx } from "./frames/inferno.js";
import { LacraiaFx } from "./frames/lacraia.js";
import { LanternaFx } from "./frames/lanterna.js";
import { MareFx } from "./frames/mare.js";
import { NebulosaFx } from "./frames/nebulosa.js";
import { NeonFx } from "./frames/neon.js";
import { OrbitaFx } from "./frames/orbita.js";
import { PortalFx } from "./frames/portal.js";
import { RadarFx } from "./frames/radar.js";
import { SeasonalFrameFx } from "./frames/seasonal/seasonal-frame-fx.js";
import { SupernovaFx } from "./frames/supernova.js";
import { TempestadeFx } from "./frames/tempestade.js";
import { ToxicaFx } from "./frames/toxica.js";
import { TrepadeiraFx } from "./frames/trepadeira.js";
import { UivoFx } from "./frames/uivo.js";
import { VagaLumesFx } from "./frames/vaga-lumes.js";
import { VendavalFx } from "./frames/vendaval.js";

/** As molduras com efeito; a lista de ids vive em FX_FRAMES (lib/avatar-frames). */
const EFEITOS: Record<string, ComponentType<AvatarFrameFxProps>> = {
  "moldura-tempestade": TempestadeFx,
  "moldura-inferno": InfernoFx,
  "moldura-buraco-negro": BuracoNegroFx,
  "moldura-orbita": OrbitaFx,
  "moldura-glacial": GlacialFx,
  "moldura-toxica": ToxicaFx,
  "moldura-nebulosa": NebulosaFx,
  "moldura-supernova": SupernovaFx,
  "moldura-galaxia": GalaxiaFx,
  "moldura-portal": PortalFx,
  "moldura-holograma": HologramaFx,
  "moldura-mare": MareFx,
  "moldura-trepadeira": TrepadeiraFx,
  "moldura-vendaval": VendavalFx,
  "moldura-vaga-lumes": VagaLumesFx,
  "moldura-fliperama": FliperamaFx,
  "moldura-circuito": CircuitoFx,
  "moldura-neon": NeonFx,
  "moldura-radar": RadarFx,
  "moldura-caixao": CaixaoFx,
  "moldura-bruxa": BruxaFx,
  "moldura-lanterna": LanternaFx,
  "moldura-uivo": UivoFx,
  "moldura-lacraia": LacraiaFx,
  ...Object.fromEntries(SEASONAL_FX_FRAMES.map((id) => [id, SeasonalFrameFx])),
};

/**
 * No BATATA a moldura vira só o anel estático (o desenho do `data-avatar-frame`, que fica no
 * avatar): o CSS já esconde as partículas, mas elas continuariam no DOM — são até 60 nós por
 * moldura, e um feed com dez molduras com efeito monta centenas de elementos que ninguém vê.
 * A checagem é feita no render, direto no atributo do `<html>` (a fonte do modo).
 */
function decorationOff(): boolean {
  return typeof document !== "undefined" && document.documentElement.hasAttribute("data-batata");
}

/**
 * O desenho da moldura com efeito, por cima do avatar e vazando 30% para cada lado.
 * Só decoração: sem eventos de ponteiro e fora da árvore de acessibilidade.
 */
export function AvatarFrameFx({ frame }: AvatarFrameFxProps) {
  // Moldura que este front ainda não conhece: o avatar aparece normal, sem o efeito.
  if (decorationOff() || !Object.hasOwn(EFEITOS, frame)) return null;
  const Efeito = EFEITOS[frame];
  return (
    <span aria-hidden className="moldura-fx">
      <Efeito frame={frame} />
    </span>
  );
}
