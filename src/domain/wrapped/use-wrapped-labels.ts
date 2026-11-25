import { useMessages } from "../../messages/messages-context.js";
import type { WrappedPerfilChave } from "../../types/domain/wrapped/wrapped-perfil-chave.js";

/** Rótulos curtos que a view inteira reusa (todos vêm das mensagens do DS). */
export function useWrappedLabels() {
  const m = useMessages().wrapped;
  const perfil: Record<WrappedPerfilChave, string> = {
    DEBATEDOR: m.perfilDebatedor,
    ESPECIALISTA: m.perfilEspecialista,
    OBSERVADOR: m.perfilObservador,
    CRIADOR: m.perfilCriador,
    COMUNITARIO: m.perfilComunitario,
  };
  return {
    mes: (indice: number | null) => (indice == null ? null : (m.meses[indice] ?? null)),
    dia: (indice: number | null) => (indice == null ? null : (m.diasSemana[indice] ?? null)),
    perfil,
  };
}
