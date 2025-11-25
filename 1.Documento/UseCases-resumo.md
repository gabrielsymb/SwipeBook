# Use Cases - Resumo Enxuto

Formato sintético para referência rápida em implementação e testes.

Legenda campos principais:
OBJ = Objetivo | PRE = Pré-condições chave | FLUXO = Passos núcleo | OUT = Pós-condições | REGRAS = Regras críticas | DADOS = Persistência principal | METRICAS = Indicadores base

---
## UC01 Criar Agendamento
OBJ: Registrar agendamento futuro sem conflito.
PRE: Auth; prestador ativo; data hoje..+14d; horário livre; serviço válido.
TRIGGER: Prestador aciona "novo agendamento".
FLUXO: Preenche dados → valida janela & conflito → sugere duração → cria → ordena dia → audit.
OUT: Registro scheduled visível na lista.
REGRAS: (RB-AG-01..06) janela 14d; sem passado; sem conflito; duração opcional; audit obrigatório.
DADOS: client_id|walk_in; service_id; scheduled_start_at; expected_duration_min?; status=scheduled.
METRICAS: % conflitos evitados; tempo médio criação vs início; adoção de duração prevista.

## UC02 Iniciar Atendimento
OBJ: Marcar início real e ajustar agenda.
PRE: Auth; status scheduled; é o dia atual; ainda não iniciado.
TRIGGER: "Iniciar".
FLUXO: Carimba started_at → status in_progress → recalcula futuros se impacto → audit.
OUT: Agendamento movido para seção em andamento.
REGRAS: (RB-AG-10..14) só dia atual; timestamp real; reordenação; audit.
DADOS: started_at; status=in_progress.
METRICAS: % antecipados; % atrasados; atraso médio acumulado.

## UC03 Concluir Atendimento
OBJ: Encerrar atendimento e consolidar duração real.
PRE: Auth; status in_progress; started_at existe; dia atual.
TRIGGER: "Concluir".
FLUXO: Carimba ended_at → calcula real_duration_min → status done → separa concluídos → audit.
OUT: Registro congelado.
REGRAS: (RB-AG-20..25) só iniciado conclui; duração obrigatória; irreversível; audit.
DADOS: ended_at; real_duration_min; status=done.
METRICAS: duração real média; variação prevista vs real; taxa conclusão.

## UC04 Cancelar Agendamento
OBJ: Encerrar e liberar slot antes da execução completa.
PRE: Auth; status ∈ {scheduled,in_progress}.
TRIGGER: "Cancelar".
FLUXO: Valida → status canceled → canceled_at → libera slot → audit.
OUT: Registro permanente cancelado; horário livre.
REGRAS: RN04.01..04 mantenha histórico; timestamp; só estados permitidos.
DADOS: canceled_at; status=canceled.
METRICAS: % cancelamentos; antecedência média; distribuição por horário.

## UC05 Excluir Agendamento (Admin)
OBJ: Remover operacionalmente mantendo histórico lógico.
PRE: Permissão admin; existe; status ≠ in_progress.
TRIGGER: "Excluir".
FLUXO: Valida permissão & status → soft delete (status=deleted / deleted_at) → oculta da lista → audit.
OUT: Não aparece em visão operacional.
REGRAS: RN05.01..04 histórico preservado; bloqueio execução; permissão restrita.
DADOS: deleted_at; status=deleted.
METRICAS: % exclusões; tempo vida médio; motivos (quando coletado).

## UC06 Reagendar Agendamento
OBJ: Alterar data/hora/serviço preservando histórico e fila.
PRE: Auth; status ∉ {in_progress,done}; nova data futura ≤14d; sem passado.
TRIGGER: "Reagendar".
FLUXO: Exibe opções → valida janela & conflito → aplica novo scheduled_start_at → salva previous_start_at + rescheduled_at → recalcula fila → audit.
OUT: Horário atualizado; histórico preservado.
REGRAS: RN06.01..05 sem retroativo; exclusividade; histórico; propagação fila.
DADOS: scheduled_start_at; previous_start_at; rescheduled_at.
METRICAS: taxa reagendamento; variação média minutos; impacto acumulado fila.

## UC07 Editar Agendamento (Dados Complementares)
OBJ: Ajustar dados não temporais sem afetar tempo/ status.
PRE: Auth; status ∉ {canceled,done}; payload só campos permitidos.
TRIGGER: "Editar".
FLUXO: Carrega campos → valida escopo & formatos → persiste → audit updated → atualiza timestamp.
OUT: Dados administrativos atualizados; logística intacta.
REGRAS: RN07.01..06 imutabilidade tempo & status; sem impacto fila; audit; valida escopo.
DADOS: subset campos administrativos; atualizado_em.
METRICAS: frequência edições; campos mais alterados; relação edições vs cancelamento.

---
Notas Gerais:
• Audit sempre presente para CREATE/START/FINISH/CANCEL/DELETE/RESCHEDULE/UPDATE.
• Janela temporal: hoje até +14 dias (criação/reagendamento).
• Campos temporais só mudam em UC01, UC02, UC03, UC04 (timestamp), UC05 (delete), UC06.
• UC07 não altera scheduling nem status.
