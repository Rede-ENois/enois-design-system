import type { DocumentoLegalPaginaProps } from "../../types/domain/documentos/documento-legal-pagina-props.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";

import { LegalSection } from "./legal-layout.js";

/**
 * "Meus documentos": o que está em vigor, o que falta aceitar e o aceite explícito.
 *
 * Só desenha. O texto do documento chega já montado pelo app (`children`), no editor de texto da
 * casa; o aceite é um ato explícito — o botão mostra o texto que está aberto, e o app manda ao
 * servidor o id DAQUELA versão. Nada aqui marca aceite sozinho por a pessoa ter aberto a página.
 */
export function DocumentoLegalMeus({
  title,
  intro,
  logado,
  state,
  loadingLabel,
  errorLabel,
  pendentes,
  texto,
  children,
  aceitandoId,
  onAceitar,
  labels,
  onLerAtual,
  historico,
}: DocumentoLegalPaginaProps) {
  const pendenteDoTexto = texto ? pendentes.find((item) => item.tipo === texto.tipo) : undefined;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

        <p className="text-sm text-text-subtle">{intro}</p>
      </header>

      {state === "loading" ? (
        <p role="status" className="text-sm text-text-subtle">
          {loadingLabel}
        </p>
      ) : null}

      {state === "error" ? <EmptyState title={title} description={errorLabel} /> : null}

      {state === "ready" && logado ? (
        <LegalSection title={labels.pendenciaTitulo}>
          {pendentes.length > 0 ? <p>{labels.pendenciaIntro}</p> : <p>{labels.aceiteFeito}</p>}

          <div className="flex flex-wrap gap-3">
            {pendentes.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                size="sm"
                onClick={() => onLerAtual(item.tipo)}
              >
                {`${item.titulo} — ${labels.versao(item.versao)}`}
              </Button>
            ))}
          </div>
        </LegalSection>
      ) : null}

      {state === "ready" && !logado ? (
        <EmptyState title={labels.pendenciaTitulo} description={labels.pendenciaIr} />
      ) : null}

      {texto ? (
        <section className="space-y-3" aria-label={texto.titulo}>
          <h2 className="text-lg font-semibold tracking-tight">{texto.titulo}</h2>

          {children}

          <p className="text-xs text-text-subtle">
            {pendenteDoTexto ? labels.naoVigente : labels.vigente}
          </p>

          {logado && pendenteDoTexto ? (
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button
                onClick={() => onAceitar?.()}
                disabled={!onAceitar || aceitandoId === pendenteDoTexto.id}
              >
                {aceitandoId === pendenteDoTexto.id ? labels.aceitando : labels.aceitar}
              </Button>

              {aceitandoId === null ? (
                <span className="text-xs text-text-subtle">{labels.aceiteAviso}</span>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {historico.length > 0 ? (
        <footer className="border-t border-border pt-6">
          <LegalSection title={labels.historico}>
            <div className="flex flex-wrap gap-3">
              {historico.map((item) => (
                <Button
                  key={`${item.tipo}-${item.versao}`}
                  variant="outline"
                  size="sm"
                  onClick={item.onAbrir}
                >
                  {`${item.titulo} — ${labels.versao(item.versao)}${item.vigente ? ` (${labels.vigente})` : ""}`}
                </Button>
              ))}
            </div>
          </LegalSection>
        </footer>
      ) : null}
    </div>
  );
}
