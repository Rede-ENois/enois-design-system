export type SearchFieldProps = {
  /** O termo digitado; quem compõe é dono do estado (a busca em si acontece lá). */
  value: string;
  onChange: (value: string) => void;
  /** Rótulo do campo e texto de exemplo, servindo de `aria-label` para quem passa por leitor de tela. */
  placeholder: string;
  /** Liga o rótulo escondido ao campo; sem ele o React gera um id. */
  id?: string;
};
