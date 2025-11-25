
# Arquitetura de UX — SwipeBook (Entrega Final)

## Resumo
Visão: UX móvel-first, “one-handed first”, minimalista e resiliente (offline-first). Foco: rapidez no agendamento e reordenação, feedback imediato e confiança operacional.

Componentes centrais:
- Tela Principal (Lista do Dia) com DnD e Swipe Actions  
- DockPlayer fixo (minimizado / expandido / oculto) com progress bar e controles (Iniciar / Pausar / Concluir)  
- Bottom-sheet Criar / Editar Agendamento  
- Day Navigator / Calendário (±14 dias)  
- Relatório rápido (Apurado do Dia)

---

## DockPlayer — resumo técnico
- Estados: `minimized`, `expanded`, `hidden`
- Mostra próximo agendamento, progress bar, controles (start/pause/stop), status de sincronização.
- Offline: enfileira operações em IndexedDB; UI mostra badge “Pendente”.
- Heartbeats: a cada 15s (configurável). Server aceita start/heartbeat/stop endpoints.

---

## API (sessions) — resumo
Endpoints principais:
- POST /sessions
- POST /sessions/{id}/heartbeat
- PATCH /sessions/{id}/pause
- POST /sessions/{id}/stop
- GET /sessions/active
- GET /appointments/next

Idempotency via `client_op_id` ou header `Idempotency-Key`.

---

## Banco (sessions)
Tabela `sessions` armazena sessões ativas com started_at, last_heartbeat_at, elapsed_ms, status, stopped_at, etc.
Ao finalizar sessão, backend grava `appointments.ended_at` e `appointments.real_duration_ms`.

---

## Métricas e telemetria
Eventos a enviar:
- session_started
- session_heartbeat
- session_paused
- session_resumed
- session_stopped
- dock_minimized / dock_expanded / dock_hidden

KPIs:
- avg session length
- % sessions with overrun
- % ops pending after reconnection
- % conflicts 409

---

## Critérios de aceitação (resumo)
- Criar agendamento: ≤3 toques; aparece na lista (optimistic) <200ms.
- DnD: persistência via API com consistência em 95% dos testes.
- DockPlayer: start/stop gravam campos no backend; progress bar atualiza a cada 1s.
- Offline: ops enfileiradas e sincronizadas ao reconectar; UI mostra pendente.

---

## Checklist rápido
- [ ] Paleta e tokens no repo
- [ ] Migration `sessions`
- [ ] Endpoints sessions com idempotency
- [ ] DockPlayer + timer local
- [ ] IndexedDB op-queue + background sync
- [ ] Conflict handling (409) + UI reconciliação
- [ ] Testes manuais com prestadores
- [ ] Instrumentar métricas

---
