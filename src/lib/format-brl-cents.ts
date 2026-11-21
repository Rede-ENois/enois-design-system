const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Centavos no formato da moeda do site (R$ 20,00). */
export function formatBrlCents(centavos: number): string {
  return brl.format(centavos / 100);
}
