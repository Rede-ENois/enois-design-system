import type React from "react";

import type * as TabsPrimitive from "@radix-ui/react-tabs";

import type { TabsListRows } from "./tabs-list-rows.js";

export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  /**
   * `single` (padrão): uma linha que rola para o lado. `wrap`: no celular as abas quebram em
   * linhas de três, cada uma com um terço da faixa, e do `sm` para cima voltam a uma linha só.
   */
  rows?: TabsListRows;
};
