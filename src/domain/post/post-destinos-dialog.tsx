import { Bookmark, LayoutDashboard, Loader2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { PostDestinoItem } from "../../types/domain/post/post-destino-item.js";
import type { PostDestinosDialogProps } from "../../types/domain/post/post-destinos-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs.js";

/**
 * Uma linha de destino (mural ou coleção): o quadro diz o que é, a contagem diz o tamanho e a
 * flag `tem` transforma a ação em estado — onde o post já está, o verbo vira "colado/guardado"
 * e o botão nem tenta a duplicada.
 */
function DestinoLinha({
  destino,
  icone,
  pendente,
  erro,
  acao,
  acaoFeita,
  falhou,
  aoEscolher,
}: {
  destino: PostDestinoItem;
  icone: (ativo: boolean) => React.ReactNode;
  pendente: boolean;
  erro: boolean;
  acao: string;
  acaoFeita: string;
  falhou: string;
  aoEscolher: () => void;
}) {
  const mensagens = useMessages().postDestinos;
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition sm:px-4 ${
        erro
          ? "border-destructive/40 bg-destructive/5"
          : destino.tem
            ? "border-primary/40 bg-primary-soft/40"
            : "border-border-soft"
      }`}
    >
      {icone(destino.tem)}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-strong">{destino.title}</p>

        <p className="text-xs text-text-subtle">
          {mensagens.itens(destino.count)}
          {erro ? ` · ${falhou}` : destino.tem ? ` · ${acaoFeita}` : ""}
        </p>
      </div>

      {!destino.tem && (
        // `size="sm"` (e não o default): o default traz `w-full`, que com `shrink-0` disputa a
        // linha inteira e esmaga o bloco de texto a largura 0 — o texto voltava a renderizar
        // caractere por caractere no mobile.
        <Button
          variant="outline"
          size="sm"
          className="w-auto shrink-0 rounded-full px-4"
          disabled={pendente}
          onClick={aoEscolher}
        >
          {pendente ? <Loader2 className="h-4 w-4 animate-spin" /> : acao}
        </Button>
      )}
    </div>
  );
}

/**
 * Para onde este post vai sem sair do card: murais (colar, visível a quem visita o quadro) e
 * coleções (guardar, só do dono). O app busca as listas — o diálogo é o desenho do seletor,
 * com a marca de onde o post já está e o pending de cada tentativa.
 */
export function PostDestinosDialog({
  open,
  onOpenChange,
  postId,
  murais,
  colecoes,
  carregando = false,
  pendentes,
  erro,
  onColarNoMural,
  onGuardarNaColecao,
  footer,
}: PostDestinosDialogProps) {
  const mensagens = useMessages().postDestinos;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-3 p-4 sm:gap-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-normal">{mensagens.title}</DialogTitle>

          <DialogDescription className="text-sm leading-relaxed text-text-subtle">
            {mensagens.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="murais" className="pt-1">
          <TabsList className="w-full">
            <TabsTrigger value="murais" className="flex-1">
              {mensagens.tabMurais}
            </TabsTrigger>

            <TabsTrigger value="colecoes" className="flex-1">
              {mensagens.tabColecoes}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="murais" className="max-h-72 overflow-y-auto">
            {murais.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-subtle">
                {carregando ? mensagens.loading : mensagens.vazioMurais}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {murais.map((mural) => (
                  <DestinoLinha
                    key={`destinos-${postId}-${mural.id}`}
                    destino={mural}
                    icone={(ativo) => (
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                          ativo
                            ? "bg-primary-soft text-primary-text"
                            : "bg-surface-2 text-text-subtle"
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                      </span>
                    )}
                    pendente={pendentes.has(mural.id)}
                    erro={erro?.destinoId === mural.id}
                    acao={mensagens.colar}
                    acaoFeita={mensagens.colado}
                    falhou={mensagens.acaoFalhou}
                    aoEscolher={() => onColarNoMural(mural.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="colecoes" className="max-h-72 overflow-y-auto">
            {colecoes.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-subtle">
                {carregando ? mensagens.loading : mensagens.vazioColecoes}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {colecoes.map((colecao) => (
                  <DestinoLinha
                    key={`destinos-${postId}-${colecao.id}`}
                    destino={colecao}
                    icone={(ativo) => (
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                          ativo
                            ? "bg-primary-soft text-primary-text"
                            : "bg-surface-2 text-text-subtle"
                        }`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </span>
                    )}
                    pendente={pendentes.has(colecao.id)}
                    erro={erro?.destinoId === colecao.id}
                    acao={mensagens.guardar}
                    acaoFeita={mensagens.guardado}
                    falhou={mensagens.acaoFalhou}
                    aoEscolher={() => onGuardarNaColecao(colecao.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {footer}
      </DialogContent>
    </Dialog>
  );
}
