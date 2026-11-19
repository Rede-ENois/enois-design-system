/** Uma organização do GitHub de quem está logado: a lista de onde se escolhe o que importar. */
export type GithubOrganization = {
  login: string;
  /** Nome de exibição; sem ele o app usa o login. */
  name: string | null;
  htmlUrl: string;
};
