import type { GithubOrganization } from "./github-organization.js";
import type { GithubRepoRow } from "./github-repo-row.js";

/** O que o diálogo de importação de organização mostra; a seleção e as chamadas são do app. */
export type GithubOrgImportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  hint: string;
  /** Rótulo do grupo de organizações (leitor de tela). */
  chooseLabel: string;
  orgs: {
    loading: boolean;
    error: boolean;
    items: GithubOrganization[];
  };
  selectedOrg: string | null;
  onSelectOrg: (login: string) => void;
  /** A organização selecionada, para o link do GitHub. */
  activeOrg: GithubOrganization | null;
  repos: {
    loading: boolean;
    error: boolean;
    rows: GithubRepoRow[];
  };
  /** `fullName` dos repositórios marcados; o app guarda e limpa depois de importar. */
  selected: string[];
  onToggle: (fullName: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
  importing: boolean;
  onImport: () => void;
};
