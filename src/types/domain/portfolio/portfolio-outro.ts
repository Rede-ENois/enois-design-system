/**
 * Um card do perfil que pode entrar na peça de projeto. `state` diz por que ele não entra quando
 * não entra: o limite de peças é do servidor, e o que já está no portfólio não precisa aparecer
 * duas vezes na lista.
 */
export type PortfolioOutro = {
  id: string;
  title: string;
  state: "available" | "used" | "full";
};
