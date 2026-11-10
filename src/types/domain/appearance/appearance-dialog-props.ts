import type { ReactNode } from "react";

import type { BackgroundStyle } from "../../lib/theme/background-style.js";
import type { ProfileNameStyle } from "../../lib/theme/profile-name-style.js";
import type { ThemeCollection } from "../../lib/theme/theme-collection.js";
import type { ThemeSettings } from "../../lib/theme/theme-settings.js";
import type { Theme } from "../../lib/theme/theme.js";

import type { AppearanceFileStatus } from "./appearance-file-status.js";
import type { AppearanceNameStyleSelection } from "./appearance-name-style-selection.js";
import type { PurchasedThemesProps } from "./purchased-themes-props.js";

export type AppearanceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Nome exibido na prévia do estilo do nome. */
  profileName?: string;
  nameStyle: AppearanceNameStyleSelection;
  /** Chamado com o estilo completo (tema, fonte e cor) a cada escolha. */
  onNameStyleChange: (style: ProfileNameStyle) => void;
  mode: Theme;
  onModeChange: (mode: Theme) => void;
  settings: ThemeSettings;
  onSettingsChange: (settings: ThemeSettings) => void;
  /** Identificador da coleção ativa; `null` é o padrão da marca. */
  collectionId: string | null;
  /** A coleção ativa já resolvida (`null` quando não há ou não existe mais). */
  activeCollection: ThemeCollection | null;
  onCollectionSelect: (collectionId: string | null) => void;
  /** Coleção em prévia (experimentar sem gravar); `null`/ausente = nada em prévia. */
  previewCollectionId?: string | null;
  /** Chamado ao experimentar: aplica na hora e o fechar do diálogo desfaz o que não foi aplicado. */
  onCollectionPreview: (collectionId: string | null) => void;
  /** Temas comprados na loja (aba global); sem isto, a seção não aparece (ex.: sem login). */
  purchasedThemes?: PurchasedThemesProps;
  widgetBackground: BackgroundStyle | null;
  onWidgetBackgroundChange: (style: BackgroundStyle | null) => void;
  pageBackground: BackgroundStyle | null;
  onPageBackgroundChange: (style: BackgroundStyle | null) => void;
  onExport: () => void;
  onImport: (file: File) => void;
  fileStatus: AppearanceFileStatus | null;
  onSell: () => void;
  /** Cor da tag "Contribuinte"; `null` usa a cor primária. */
  contributorTagColor?: string | null;
  /** Só quem tem contribuição verificada escolhe a cor: sem este callback, a seção não aparece. */
  onContributorTagColorChange?: (color: string | null) => void;
  onReset: () => void;
  /** O diálogo de venda, renderizado junto (o app controla abrir e fechar). */
  sellDialog?: ReactNode;
  /**
   * Owned cosmetics (frames, badges, banners) to equip from here, issue #566. Without
   * it the "Itens" tab does not show (e.g. signed out).
   */
  itemsSlot?: ReactNode;
};
