export type EmoteCellProps = {
  code: string;
  /** Sem imagem: a figurinha saiu do catálogo e não há miniatura guardada. */
  src?: string;
  onSelect: (code: string) => void;
};
