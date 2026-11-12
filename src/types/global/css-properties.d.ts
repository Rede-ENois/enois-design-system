/**
 * Precisa ser importado por alguém para entrar na emissão do `dist` — a linha no
 * `src/index.ts` existe para isso (a declaração não gera código, só tipos).
 */
import "react";

/**
 * O padrão do lint de views é passar valores de runtime para o CSS como custom properties
 * (`style={{ "--swatch": color }}`, lidas por uma classe). O `CSSProperties` do React não conhece
 * essas chaves — sem esta declaração o TypeScript recusa o literal (`TS2353`) e o único caminho
 * seria `as CSSProperties`, que a regra `local/style-only-css-vars` recusa por esconder o objeto
 * do lint. Aqui o padrão documentado passa a compilar sem asserção.
 */
declare module "react" {
  interface CSSProperties {
    [customProperty: `--${string}`]: string | number | undefined;
  }
}
