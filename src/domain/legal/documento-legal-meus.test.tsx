// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { DocumentoLegalAdminRotulos } from "../../types/domain/documentos/documento-legal-admin-rotulos.js";
import type { DocumentoLegalPaginaProps } from "../../types/domain/documentos/documento-legal-pagina-props.js";

import { DocumentoLegalAdmin, DocumentoLegalPublicarConfirmacao } from "./documento-legal-admin.js";
import { DocumentoLegalMeus } from "./documento-legal-meus.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

const LABELS: DocumentoLegalPaginaProps["labels"] = {
  pendenciaTitulo: "O que falta aceitar",
  pendenciaIntro: "Estes textos pedem o seu aceite.",
  pendenciaIr: "Entre para aceitar.",
  aceito: (data) => `Aceito em ${data}.`,
  aceitar: "Li e aceito esta versão",
  aceitando: "Registrando...",
  aceiteAviso: "O aceite registra a versão.",
  aceiteErro: "Não foi possível registrar.",
  aceiteFeito: "Você aceitou todas as versões em vigor.",
  historico: "Versões anteriores",
  versao: (versao) => `versão ${versao}`,
  vigente: "Versão em vigor.",
  naoVigente: "Ainda não está em vigor.",
  anterior: "Ler a versão anterior",
};

function props(overrides: Partial<DocumentoLegalPaginaProps> = {}): DocumentoLegalPaginaProps {
  return {
    title: "Meus documentos",
    intro: "Os textos que valem hoje.",
    logado: true,
    state: "ready",
    loadingLabel: "Carregando os documentos...",
    errorLabel: "Não foi possível carregar.",
    pendentes: [{ id: "dl_1", tipo: "DIRETRIZES", titulo: "Diretrizes", versao: 2 }],
    texto: { tipo: "DIRETRIZES", titulo: "Diretrizes — versão 2", conteudo: "" },
    children: <p>Texto das diretrizes</p>,
    aceitandoId: null,
    onAceitar: () => {},
    labels: LABELS,
    onLerAtual: () => {},
    historico: [],
    ...overrides,
  };
}

function render(overrides: Partial<DocumentoLegalPaginaProps> = {}) {
  act(() => root.render(<DocumentoLegalMeus {...props(overrides)} />));
  return host;
}

function botao(rotulo: string) {
  return Array.from(host.querySelectorAll("button")).find((item) =>
    item.textContent?.includes(rotulo),
  );
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("DocumentoLegalMeus", () => {
  it("mostra a pendência, o texto aberto e o aceite", () => {
    render();

    const texto = host.textContent ?? "";
    expect(texto).toContain("O que falta aceitar");
    expect(texto).toContain("Diretrizes — versão 2");
    expect(texto).toContain("Texto das diretrizes");
    expect(texto).toContain("Ainda não está em vigor.");
    expect(botao(LABELS.aceitar)).toBeDefined();
  });

  it("o aceite só aparece para a versão que pede aceite", () => {
    render({ pendentes: [] });

    expect(botao(LABELS.aceitar)).toBeUndefined();
    expect(host.textContent).toContain(LABELS.vigente);
    expect(host.textContent).toContain(LABELS.aceiteFeito);
  });

  it("sem sessão não há botão de aceite", () => {
    render({ logado: false, pendentes: [] });

    expect(botao(LABELS.aceitar)).toBeUndefined();
    expect(host.textContent).toContain(LABELS.pendenciaIr);
  });

  it("aceitando, o botão diz que está registrando e não deixa clicar de novo", () => {
    render({ aceitandoId: "dl_1" });

    const emAndamento = botao(LABELS.aceitando);
    expect(emAndamento).toBeDefined();
    expect(emAndamento?.disabled).toBe(true);
  });
});

describe("DocumentoLegalAdmin", () => {
  const ROTULOS = {
    tituloSecao: "Nova versão",
    apenasAdmin: "Só admin",
    versao: (versao: number) => `versão ${versao}`,
    vigente: "em vigor",
    naoVigente: "fora de vigor",
    tipo: "Documento",
    titulo: "Título",
    resumo: "Resumo",
    conteudo: "Texto",
    conteudoAjuda: "Texto leve.",
    enviar: "Criar rascunho",
    enviando: "Criando...",
    erro: "Não criou.",
    criarFeito: (versao: number) => `Rascunho ${versao}.`,
    publicar: "Publicar",
    publicarAviso: "Publicar põe em vigor.",
    publicando: "Publicando...",
    confirmar: "Confirmar",
    cancelar: "Cancelar",
    publicado: "Publicado.",
    publicadoErro: "Erro.",
    vazio: "Nada publicado.",
    publicados: "No ar",
    confirmacaoTitulo: "Confirmar",
  } satisfies DocumentoLegalAdminRotulos;

  it("sem texto não dá para criar o rascunho", () => {
    act(() =>
      root.render(
        <DocumentoLegalAdmin
          labels={ROTULOS}
          tipo="DIRETRIZES"
          opcoesTipo={[{ valor: "DIRETRIZES", rotulo: "Diretrizes" }]}
          onTipo={() => {}}
          titulo=""
          onTitulo={() => {}}
          resumo=""
          onResumo={() => {}}
          conteudo=""
          onConteudo={() => {}}
          rascunho={{ estado: "inicial", versao: null }}
          onEnviar={() => {}}
          idRascunho={null}
          publicando={false}
          onPublicar={() => {}}
          publicados={[]}
        />,
      ),
    );

    expect(botao(ROTULOS.enviar)?.disabled).toBe(true);
    expect(botao(ROTULOS.publicar)).toBeUndefined();
  });

  it("publicar é um segundo ato, separado do rascunho", () => {
    let publicou = 0;
    act(() =>
      root.render(
        <DocumentoLegalAdmin
          labels={ROTULOS}
          tipo="TERMOS_DE_USO"
          opcoesTipo={[{ valor: "TERMOS_DE_USO", rotulo: "Termos" }]}
          onTipo={() => {}}
          titulo="Termos v2"
          onTitulo={() => {}}
          resumo=""
          onResumo={() => {}}
          conteudo="Texto completo"
          onConteudo={() => {}}
          rascunho={{ estado: "criado", versao: 2 }}
          onEnviar={() => {}}
          idRascunho="dl_2"
          publicando={false}
          onPublicar={() => publicou++}
          publicados={[
            { id: "dl_1", tipo: "TERMOS_DE_USO", versao: 1, titulo: "Termos", vigente: true },
          ]}
        />,
      ),
    );

    expect(host.textContent).toContain("Rascunho 2.");
    expect(host.textContent).toContain("Termos — versão 1");
    act(() => (botao(ROTULOS.publicar) as HTMLButtonElement).click());
    expect(publicou).toBe(1);
  });

  it("a confirmação da publicação pode ser cancelada", () => {
    let cancelou = 0;
    act(() =>
      root.render(
        <DocumentoLegalPublicarConfirmacao
          labels={ROTULOS}
          aberta
          publicando={false}
          onConfirmar={() => {}}
          onCancelar={() => cancelou++}
        />,
      ),
    );

    expect(host.textContent).toContain(ROTULOS.publicarAviso);
    act(() => (botao(ROTULOS.cancelar) as HTMLButtonElement).click());
    expect(cancelou).toBe(1);
  });
});
