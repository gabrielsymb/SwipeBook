// frontend/src/modules/session/hooks/useSessionHeartbeat.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { sessionApi } from "../../../api/session";
import type {
  ApiErrorResponse,
  HeartbeatRequestDTO,
  Sessao,
} from "../../../api/types";
import { useSessionStore } from "../../../store/SessionStore";

// O intervalo de sincronização com o Backend (30 segundos = 30000ms)
const SYNC_INTERVAL_MS = 30000;

// Chave de cache
const SESSION_QUERY_KEY = "activeSession";

/**
 * @description Hook customizado que gerencia o envio periódico do Heartbeat para o servidor.
 */
export function useSessionHeartbeat(options: { enabled?: boolean } = {}) {
  const queryClient = useQueryClient();
  const { enabled = true } = options;

  // Extrai o estado do store (reativo: o componente re-renderiza se mudar)
  const { session } = useSessionStore();

  // Armazena o timestamp do último Heartbeat enviado, evitando re-renderização
  // Não inicializamos com Date.now() diretamente durante a render (impuro).
  // Inicializamos como undefined e setamos no primeiro efeito.
  const lastSyncRef = useRef<number | undefined>(undefined);

  // 1. MUTAÇÃO: Função para enviar o Heartbeat (uso interno)
  const heartbeatMutation = useMutation<
    Sessao,
    ApiErrorResponse,
    HeartbeatRequestDTO & { sessionId: string } // Payload que inclui o ID
  >({
    mutationFn: ({ sessionId, elapsedMs }) =>
      sessionApi.sendHeartbeat(sessionId, { elapsedMs }),

    // Atualiza o cache após o sucesso para sincronizar o elapsed_ms do servidor
    onSuccess: (data) => {
      // Atualiza o cache da sessão ativa com os dados mais recentes do servidor
      queryClient.setQueryData([SESSION_QUERY_KEY], data);
      lastSyncRef.current = Date.now(); // Marca o novo tempo de sincronização

      console.log(`Heartbeat enviado. Novo total: ${data.elapsed_ms}ms.`);
    },

    onError: (error) => {
      // Falha no Heartbeat. A sessão local continua, mas alerta é necessário.
      console.error("Falha ao enviar Heartbeat:", error);
      // TODO: Adicionar lógica de alerta para o usuário, mas manter timer rodando
    },
  });

  // 2. EFEITO: Configuração e Limpeza do Intervalo de Sincronização
  useEffect(() => {
    // Só sincroniza se o hook estiver habilitado E houver uma sessão ATIVA
    const isActive = enabled && session && session.status === "active";

    if (!isActive) {
      // Se inativo, garante que o timer não está rodando
      return;
    }
    // Se ainda não temos um timestamp inicial, define como agora.
    if (lastSyncRef.current === undefined) {
      lastSyncRef.current = Date.now();
    }

    const intervalId = setInterval(() => {
      const sessionId = session!.id;

      // Delta de tempo desde a última sincronização REAL (cuidado para não usar tick local)
      const now = Date.now();
      const previous = lastSyncRef.current ?? now;
      const deltaMs = now - previous;

      // Garante que o delta é positivo e dentro de uma margem razoável (por segurança)
      if (deltaMs > 0) {
        // Envia o delta para o Backend
        heartbeatMutation.mutate({ sessionId, elapsedMs: deltaMs });
      }
    }, SYNC_INTERVAL_MS);

    // Função de limpeza: essencial para evitar vazamento de memória
    return () => clearInterval(intervalId);
  }, [session, heartbeatMutation, enabled]); // Dependências: inclui enabled

  // O hook não retorna nada; sua função é apenas gerenciar o side effect.
}
