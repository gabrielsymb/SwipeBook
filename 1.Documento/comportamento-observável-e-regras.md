## COMPORTAMENTO OBSERVÁVEL

Camada objetiva: o que o sistema DEVE demonstrar quando o fluxo ocorre conforme as regras.

Estrutura por caso de uso:
• Ação do usuário
• Estado(s) alterado(s)
• Mudanças na UI
• Persistência
• Efeitos secundários

---

### UC01 — Criar Agendamento

• Ação: Prestador confirma criação no modal.
• Estado: status=scheduled; scheduled_start_at definido; position_key (LexoRank) atribuída.
• UI: item aparece na lista em “Agendados”; ordenação correta; contadores atualizam.
• Persistência: INSERT appointments; INSERT audit_log {event=create}.
• Efeitos: nenhum impacto em outros agendamentos; não recalcula horários; não reordena demais.

### UC02 — Iniciar Atendimento

• Ação: Prestador toca em “Iniciar”.
• Estado: status=in_progress; started_at carimbado; horário previsto liberado se adiantado.
• UI: item move para “Em execução” com destaque; ordenação ajusta se necessário.
• Persistência: UPDATE appointment {status, started_at}; INSERT audit_log {event=start}. (Sem ajuste de position_key.)
• Efeitos: pode recalcular expected_start_at dos futuros; fila pode ser reordenada.

### UC03 — Concluir Atendimento

• Ação: Prestador toca “Concluir”.
• Estado: status=done; ended_at; real_duration_min calculado.
• UI: item desce para “Concluídos”; congelado; remove botões de ação; estatísticas atualizam.
• Persistência: UPDATE appointment {ended_at, real_duration_min, status}; INSERT audit_log {event=finish}.
• Efeitos: não altera futuros; não muda posição entre concluídos; não recalcula fila.

### UC04 — Cancelar Agendamento

• Ação: Prestador confirma cancelamento.
• Estado: status=canceled; canceled_at registrado.
• UI: item vai para “Cancelados” com estilo reduzido; agenda reorganiza se necessário.
• Persistência: UPDATE appointment {canceled_at, status}; INSERT audit_log {event=cancel}.
• Efeitos: libera slot; sem recompactação de chaves (position_key é independente).

### UC05 — Excluir Agendamento

• Ação: Prestador confirma exclusão.
• Estado: status=deleted; deleted_at registrado.
• UI: item removido imediatamente da lista.
• Persistência: UPDATE appointment {deleted_at, status}; INSERT audit_log {event=delete}.
• Efeitos: recompacta posições se necessário.

### UC06 — Reagendar Agendamento

• Ação: Prestador altera data/hora.
• Estado: scheduled_start_at atualizado; previous_start_at preservado; rescheduled_at registrado.
• UI: item muda de posição; desloca vizinhos; horários exibidos atualizam.
• Persistência: UPDATE appointment {scheduled_start_at, previous_start_at, rescheduled_at, position_key}; INSERT audit_log {event=reschedule}.
• Efeitos: recalcula posição lexical no dia alvo (nova position_key) e pode mover entre dias.

### UC07 — Editar Dados Complementares

• Ação: Prestador salva edição administrativa.
• Estado: somente campos administrativos atualizados.
• UI: texto/atributos visuais ajustados localmente; posição/seção inalteradas.
• Persistência: UPDATE appointment (subset permitido); INSERT audit_log {event=update}.
• Efeitos: nenhum recálculo de agenda; nenhuma reordenação.
