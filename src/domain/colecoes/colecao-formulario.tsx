import { useEffect, useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { ColecaoFormularioProps } from "../../types/domain/colecoes/colecao-formulario-props.js";
import { Button } from "../../ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

/**
 * Criação e edição de coleção (o diálogo serve aos dois: título e descrição chegam preenchidos na
 * edição). A recusa de salvamento acontece no app: enquanto o erro não deixa, o rascunho segue
 * na linha — o diálogo só fecha quando quem compõe fecha.
 */
export function ColecaoFormulario({
  aberto,
  tituloInicial = "",
  descricaoInicial = "",
  ocupado,
  onSalvar,
  onFechar,
}: ColecaoFormularioProps) {
  const messages = useMessages().colecoesFormulario;
  const [titulo, setTitulo] = useState(tituloInicial);
  const [descricao, setDescricao] = useState(descricaoInicial);

  // Reabrir o diálogo recarrega o rascunho: criação limpa, edição preenche.
  useEffect(() => {
    if (aberto) {
      setTitulo(tituloInicial);
      setDescricao(descricaoInicial);
    }
  }, [aberto, tituloInicial, descricaoInicial]);

  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && onFechar()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tituloInicial ? messages.editarTitulo : messages.criarTitulo}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSalvar({ title: titulo, description: descricao });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="colecao-titulo">{messages.titleLabel}</Label>

            <Input
              id="colecao-titulo"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder={messages.titlePlaceholder}
              maxLength={120}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colecao-descricao">{messages.descriptionLabel}</Label>

            <Textarea
              id="colecao-descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder={messages.descriptionPlaceholder}
              maxLength={500}
            />
          </div>

          <Button type="submit" className="w-full" disabled={ocupado || titulo.trim().length === 0}>
            {ocupado ? messages.salvando : messages.salvar}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
