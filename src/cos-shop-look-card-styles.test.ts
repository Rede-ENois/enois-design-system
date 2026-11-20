// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

/** Corpo da regra de um seletor (o primeiro bloco com esse seletor exato). */
function rule(selector: string): string {
  const pattern = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`);
  const body = pattern.exec(css)?.[1];
  expect(body, selector).toBeDefined();
  return body ?? "";
}

/**
 * O card de "Looks prontos" é um grid de duas linhas (cena em cima, rodapé com o botão de compra
 * embaixo) dentro da célula de um grid de uma linha só. Quando ele não reserva a linha do rodapé,
 * a cena fica com a altura que quiser, empurra o rodapé para fora e o `overflow: hidden` recorta
 * o botão — o sintoma da loja em algumas larguras (Rede-ENois/enois-frontend#1105).
 */
describe("card de look da loja", () => {
  it("reserva a linha do rodapé: cena cresce, rodapé mantém a altura", () => {
    expect(rule(".cos-look")).toMatch(/grid-template-rows:\s*1fr\s+auto/);
  });

  it("continua recortando o que passa da borda arredondada", () => {
    expect(rule(".cos-look")).toMatch(/overflow:\s*hidden/);
  });
});
