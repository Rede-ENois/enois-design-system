/**
 * Os filtros da busca de vagas externas, como o servidor os entende.
 *
 * Campo vazio significa "sem filtro", nunca "filtro por vazio": o app manda só o que está
 * preenchido. `publishedAfter` é uma data ISO 8601, não um rótulo de tela.
 */
export type ExternalJobFilterValues = {
  /** JUNIOR, MID, SENIOR ou LEAD. */
  level: string | null;
  /** REMOTE, HYBRID ou ONSITE. */
  workModel: string | null;
  /** CLT, PJ, INTERNSHIP, FREELANCE... */
  employmentType: string | null;
  /** Cidade da vaga, texto livre. */
  city: string;
  /** UF, texto livre. */
  state: string;
  /** País da vaga, texto livre. */
  country: string;
  /** Piso salarial em número; `null` quando não há. */
  salaryMin: number | null;
  /** Só as que declaram trabalho remoto. */
  remoteOnly: boolean;
  /** Publicadas a partir desta data (ISO 8601) ou `null`. */
  publishedAfter: string | null;
  /** `recent`, `salary` ou `relevance`. */
  sort: "recent" | "salary" | "relevance";
};
