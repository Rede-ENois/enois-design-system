/**
 * A janela de publicação escolhida na tela, em dias.
 *
 * `any` é "qualquer data". O app recebe a data ISO que a janela significa, não o rótulo: o
 * servidor não precisa saber que existe um menu de 7 e 30 dias.
 */
export type ExternalJobPublishedChoice = "any" | "7" | "30";
