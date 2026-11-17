export type MuralFormularioProps = {
  /** Diálogo aberto ou fechado; quem compõe guarda o estado. */
  aberto: boolean;
  /** Preenchidos na edição; na criação vêm vazios. */
  tituloInicial?: string;
  descricaoInicial?: string;
  /** Enquanto o app salva, o botão trava e mostra o movimento. */
  ocupado: boolean;
  onSalvar: (dados: { title: string; description: string }) => void;
  onFechar: () => void;
};
