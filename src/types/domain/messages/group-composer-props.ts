import type { GroupComposerContact } from "./group-composer-contact.js";

/**
 * Criação de grupo no chat: busca/seleção de pessoas (múltipla escolha), título e o botão de
 * criar. Dados via props (a aplicação é dona da rede); o view desenha e devolve a intenção.
 */
export type GroupComposerProps = {
  /** Contatos filtráveis pelo termo de busca (a busca é da aplicação). */
  contacts: GroupComposerContact[];
  /** Called on every search term change; the app answers with a new `contacts` list. */
  onSearch: (query: string) => void;
  /** Cria o grupo com o título e as pessoas marcadas. */
  onCreate: (title: string, participantIds: string[]) => void;
  /** True while the create request is in flight (button disables). */
  pending?: boolean;
};
