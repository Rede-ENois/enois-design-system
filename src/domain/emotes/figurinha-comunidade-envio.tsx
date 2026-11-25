import type { FigurinhaComunidadeEnvioProps } from "../../types/domain/emotes/figurinha-comunidade-envio-props.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Input } from "../../ui/input.js";

const KB = 512;
const MIME = "image/png,image/jpeg";

/**
 * O formulário de envio de uma figurinha. O arquivo é escolhido no seletor nativo (o único
 * elemento nativo do fluxo) e volta pelo `onArquivo`; o botão só libera quando o app diz que pode.
 */
export function FigurinhaComunidadeEnvio({
  logado,
  codigo,
  onCodigoChange,
  nome,
  onNomeChange,
  onArquivo,
  arquivoReset,
  enviando,
  podeEnviar,
  onEnviar,
  erro,
  labels,
  onAbrirDiretrizes,
  onEntrar,
  children,
}: FigurinhaComunidadeEnvioProps) {
  if (!logado) {
    return (
      <EmptyState title={labels.titulo} description={labels.login}>
        <Button size="sm" onClick={onEntrar}>
          {labels.entrar}
        </Button>
      </EmptyState>
    );
  }

  return (
    <section
      aria-labelledby="envio-de-figurinha"
      className="flex flex-col gap-3 rounded-xl border border-border-soft bg-surface-1 p-4"
    >
      <div className="flex flex-col gap-1">
        <h2 id="envio-de-figurinha" className="text-base font-semibold text-text-strong">
          {labels.titulo}
        </h2>

        <p className="text-sm text-text-subtle">{labels.intro}</p>
      </div>

      <label className="flex flex-col gap-1 text-sm text-text-strong">
        {labels.arquivo}

        <input
          key={arquivoReset}
          type="file"
          accept={MIME}
          disabled={enviando}
          className="text-sm text-text-subtle file:mr-3 file:rounded-md file:border file:border-border-soft file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-text-strong"
          onChange={(evento) => onArquivo(evento.target.files?.[0] ?? null)}
        />
      </label>

      <p className="text-xs text-text-subtle">{labels.ajudaArquivo(KB)}</p>

      <label className="flex flex-col gap-1 text-sm text-text-strong">
        {labels.codigo}

        <Input
          value={codigo}
          onChange={(evento) => onCodigoChange(evento.target.value)}
          placeholder={labels.codigoExemplo}
          maxLength={34}
          showCounter={false}
        />
      </label>

      <p className="text-xs text-text-subtle">
        {labels.codigoAjuda} {labels.codigoReservado}
      </p>

      <label className="flex flex-col gap-1 text-sm text-text-strong">
        {labels.nome}

        <Input
          value={nome}
          onChange={(evento) => onNomeChange(evento.target.value)}
          maxLength={60}
          showCounter={false}
        />
      </label>

      <p className="text-xs text-text-subtle">{labels.nomeAjuda}</p>

      <p className="text-xs text-text-subtle">{labels.dica}</p>

      {erro && (
        <p role="alert" className="text-sm text-destructive">
          {erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={onEnviar} disabled={enviando || !podeEnviar}>
          {enviando ? labels.enviando : labels.enviar}
        </Button>

        <Button type="button" size="sm" variant="ghost" onClick={onAbrirDiretrizes}>
          {labels.diretrizes}
        </Button>
      </div>

      {children}
    </section>
  );
}
