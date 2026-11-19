export type ReportTargetType =
  | "POST"
  | "COMMENT"
  | "USER"
  | "JOB"
  | "GROUP_POST"
  | "GROUP_COMMENT"
  | "MESSAGE"
  | "COMPANY"
  // Desabafos do Explorar (módulo próprio, tabelas fora de posts).
  | "DESABAFO_POST"
  | "DESABAFO_COMMENT"
  // Confessionário do Explorar (histórias anônimas, tabelas próprias fora de posts).
  | "CONFESSIONARIO_POST"
  | "CONFESSIONARIO_COMMENT"
  // Desafios do Explorar (convites nominais com mural, tabelas próprias fora de posts).
  | "DESAFIO_POST"
  | "DESAFIO_PARTICIPACAO";
