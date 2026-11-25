import type { DocumentoLegalAdminProps } from "../../types/domain/documentos/documento-legal-admin-props.js";
import type { DocumentoLegalPublicarConfirmacaoProps } from "../../types/domain/documentos/documento-legal-publicar-confirmacao-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

/**
 * Formulário de admin: cria o RASCUNHO de uma versão e, separado, publica.
 *
 * São dois atos de propósito. Criar rascunho não muda o que está em vigor para ninguém (nem pede
 * aceite de ninguém); publicar é o que põe o texto no ar, e pede a confirmação da pessoa. O
 * formulário é controlado pelo app: cada tecla vai para `onCampo`, e o app decide quando enviar.
 */
export function DocumentoLegalAdmin({
  labels,
  tipo,
  opcoesTipo,
  onTipo,
  titulo,
  onTitulo,
  resumo,
  onResumo,
  conteudo,
  onConteudo,
  rascunho,
  onEnviar,
  idRascunho,
  publicando,
  onPublicar,
  publicados,
}: DocumentoLegalAdminProps) {
  const enviando = rascunho.estado === "enviando";
  const faltando = !tipo || !titulo.trim() || !conteudo.trim();

  return (
    <section
      className="space-y-4 rounded-lg border border-border bg-surface-1 p-4"
      aria-label={labels.tituloSecao}
    >
      <h2 className="text-base font-semibold">{labels.tituloSecao}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="documento-tipo">{labels.tipo}</Label>

          {opcoesTipo.map((opcao) => (
            <label key={opcao.valor} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="documento-tipo"
                value={opcao.valor}
                checked={tipo === opcao.valor}
                onChange={() => onTipo(opcao.valor)}
              />
              {opcao.rotulo}
            </label>
          ))}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="documento-titulo">{labels.titulo}</Label>

          <Input
            id="documento-titulo"
            value={titulo}
            maxLength={160}
            onChange={(event) => onTitulo(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="documento-resumo">{labels.resumo}</Label>

        <Input
          id="documento-resumo"
          value={resumo}
          maxLength={1000}
          onChange={(event) => onResumo(event.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="documento-conteudo">{labels.conteudo}</Label>

        <Textarea
          id="documento-conteudo"
          value={conteudo}
          rows={18}
          spellCheck={false}
          onChange={(event) => onConteudo(event.target.value)}
        />

        <p className="text-xs text-text-subtle">{labels.conteudoAjuda}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onEnviar} disabled={enviando || faltando}>
          {enviando ? labels.enviando : labels.enviar}
        </Button>

        {rascunho.estado === "falhou" ? (
          <p role="alert" className="text-sm text-destructive">
            {labels.erro}
          </p>
        ) : null}

        {rascunho.estado === "criado" && rascunho.versao !== null ? (
          <p className="text-sm text-text-subtle">{labels.criarFeito(rascunho.versao)}</p>
        ) : null}
      </div>

      {idRascunho ? (
        <div className="space-y-2 border-t border-border pt-4">
          <p className="text-sm font-medium">{labels.publicarAviso}</p>

          <Button variant="destructive" onClick={onPublicar} disabled={publicando}>
            {publicando ? labels.publicando : labels.publicar}
          </Button>
        </div>
      ) : null}

      <div className="space-y-2 border-t border-border pt-4">
        <h3 className="text-sm font-semibold">{labels.publicados}</h3>

        {publicados.length === 0 ? (
          <p className="text-sm text-text-subtle">{labels.vazio}</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {publicados.map((item) => (
              <li key={item.id}>
                {`${item.titulo} — ${labels.versao(item.versao)}`}
                <span className="text-text-subtle">
                  {` · ${item.vigente ? labels.vigente : labels.naoVigente}`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/**
 * Confirmação da publicação: o texto entra em vigor para todo mundo e passa a ser pedido o aceite
 * de quem não aceitou essa versão. Sem confirmação explícita, nada é publicado.
 */
export function DocumentoLegalPublicarConfirmacao({
  labels,
  publicando,
  onConfirmar,
  onCancelar,
}: DocumentoLegalPublicarConfirmacaoProps) {
  return (
    <div className="space-y-3 rounded-md border border-destructive/40 bg-destructive/5 p-4">
      <p role="alert" className="text-sm font-semibold">
        {labels.publicarAviso}
      </p>

      <div className="flex flex-wrap gap-3">
        <Button variant="destructive" onClick={onConfirmar} disabled={publicando}>
          {labels.publicar}
        </Button>

        <Button variant="outline" onClick={onCancelar} disabled={publicando}>
          {labels.cancelar}
        </Button>
      </div>
    </div>
  );
}
