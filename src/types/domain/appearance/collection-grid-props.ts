export type CollectionGridProps = {
  /** Identificador da coleção aplicada de vez; `null` é o padrão da marca. */
  activeId: string | null;
  /**
   * Coleção em prévia agora — pode ser diferente da aplicada. `undefined`/`null` quando
   * nada está em prévia (o cartão da aplicada continua marcado como "Em uso").
   */
  previewId?: string | null;
  /** Experimentar: aplica na hora, sem gravar. É o que deixa a pessoa ver antes de decidir. */
  onPreview: (collectionId: string | null) => void;
  /** Aplicar de vez: grava a escolha (conta, quando houver). */
  onSelect: (collectionId: string | null) => void;
};
