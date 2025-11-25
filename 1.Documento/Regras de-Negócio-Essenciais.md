## Regras de Negócio Essenciais

### Cliente — Pendência Financeira
Definição: campo booleano `pendencia` indica se o cliente possui pagamentos em aberto ou restrições financeiras ativas.

Regras:
1) `pendencia = true` implica:
	- Pode impedir novos agendamentos (política configurável).
	- Destacar cliente na UI (badge/flag) e permitir filtro na lista de clientes.
2) `pendencia` é calculado/atualizado pela camada de aplicação a partir de eventos financeiros (ex.: faturas vencidas, pagamentos rejeitados) ou ajuste manual pelo Prestador.
3) Histórico: alterações em `pendencia` relevantes devem gerar registro em `AppointmentHistory` ou log/auditoria equivalente.
4) Endpoints:
	- GET /clients suporta filtro `pendencia=true|false`.
	- PUT /clients/{id} pode alterar `pendencia` quando o Prestador possui permissão.

Observações:
- Em um futuro escopo financeiro completo, `pendencia` pode ser derivado de `invoices`/`payments` em vez de mantido diretamente no Cliente.
 
MÓDULO: AGENDAMENTO

Regra de Negócio — consolidação das suas respostas + ajustes técnicos

1) STATUS — lista completa

Com base em literatura de sistemas de agenda e fluxo operacional (workflow lifecycle), o conjunto mínimo e consistente é:

Status possíveis:

Scheduled (Agendado)

InProgress (Em atendimento)

Done (Concluído)

Canceled (Cancelado)

(Nome interno pode ser inglês para consistência técnica, mas apresentação ao usuário em PT-BR)

2) ESTADO INICIAL

RB: todo agendamento recém-criado inicia em Scheduled (Agendado).

Não importa se veio por modal, botão, tabbar, etc.

3) TRANSIÇÕES PERMITIDAS (Matriz formal)
De → Para	Permitido?	Observação
Scheduled → InProgress	✔	início do atendimento
Scheduled → Done	✔	atalho (casos raros)
Scheduled → Canceled	✔	ok
Scheduled → Scheduled	✔	edição

| InProgress → Done | ✔ | conclui |
| InProgress → Canceled | ✔* | *decisão de negócio — permitido mas exige confirmação do usuário |
| InProgress → Scheduled | ✔ | caso retorne |

| Done → anything | ✘ | travado |
| Canceled → anything | ✘ | travado |

RB dura:

Estados finais são irreversíveis: Done e Canceled.

Esse é um padrão de workflow clássico em gestão de tarefas e saúde/serviços.

4) BLOQUEIOS

RB — NÃO pode alterar horário se:

estiver com conflito temporal direto

intervalo < 10 minutos do anterior ou próximo (rationale: evitar sobreposição operacional indevida – campo empírico forte na literatura de scheduling manual)

RB — NÃO pode alterar ordem se:

status em Done

status em Canceled

RB — NÃO pode ser cancelado se:

status = Done
(Done é fim de fluxo)

RB — NÃO pode ser excluído se:

status ≠ (Scheduled ou Canceled)
(apenas Scheduled ou Cancelado podem sumir da base)

5) REORDENAÇÃO (Drag-and-Drop)

RB — Só pode mover se:

mesmo dia

status = Scheduled

Agrupamento visual obrigatório:

Scheduled (topo)

Done (abaixo)

Canceled (abaixo de Done)

Deleted (não aparece)

RB — mover altera horário?
→ Sim.
Reordenar implica recomputar horário conforme ordem resultante.

RB — mover muda apenas a posição?
→ Não.
Sempre atualiza o horário correspondente.

6) REGRA CRONOLÓGICA

RB: é permitido arrastar um agendamento para antes da hora atual.

Rationale:
– sistemas de agenda médica e de serviços frequentemente permitem correção retroativa de ordem.
– evidência operacional: manutenção do histórico real.

7) REGRA DE SERVIÇO

RB: Serviço é obrigatório.
Não existe agendamento vazio.

Justificativa técnica:
– garante calculabilidade de duração & preço
– garante métrica produtiva
– evita “passivos lógicos”.

8) REGRA DE CLIENTE

RB: Cliente é obrigatório, porém:

Poderá existir:
Cliente Avulso (string curta / sem cadastro formal)

Ou
Cliente cadastrado completo.

Isso previne bloqueio de operação.

9) SOBRE “Pendências” do cliente

Sim, faz sentido.

Sugiro:

hasDebt: boolean
debtValue: number | null


(com base em estudos de inadimplência, boolean é insuficiente para gestão efetiva — valor é necessário)

RB: Agendamentos de cliente com pendência não devem ser bloqueados.
Mas o sistema deve alertar visualmente.

10) Cliente Avulso — campo específico?

Sim.

Entidade:

clientType: 'Person' | 'WalkIn'


se WalkIn:

walkInName: string opcional

não gera relacionamento com tabela Customers

---
## Definições Finais — Módulo Agendamento

### 1) Criação
Quem pode criar: apenas usuário autenticado.

Disponibilidade temporal:
	• Apenas datas até +14 dias no futuro.
	• Não permite datas passadas.

Conflito de horário:
	• Bloqueia criação se houver outro agendamento no mesmo horário.

Duração:
	• Se o serviço tiver duração definida → o sistema sugere.
	• Não obrigatório.
	• Caso extrapole, o sistema exibe feedback visual não intrusivo.

### 2) Iniciar Atendimento
Quem pode iniciar: apenas o prestador no app.

Horário de início:
	• Pode ser antes do horário agendado.
	• Pode ser depois.

Consequência:
	• Se inicia antes do previsto → reposiciona a agenda, recalcula horários subsequentes, preserva ordem relativa.
	• Se inicia atrasado e ultrapassa início do próximo → recalcula horários seguintes incrementando deslocamento progressivo (regra crítica).

### 3) Concluir Atendimento
Ao concluir:
	• Registra horário real de término.
	• Calcula duração real automática.
	• Proíbe edição manual de duração.
	• Troca status para Concluído.
	• Impede retorno de status.

### 4) Cancelar
	• Não exige motivo obrigatório.
	• Sempre exige confirmação.
	• Nunca retroativo.
	• Ao cancelar → status permanente.
	• Não pode voltar para Agendado.

### 5) Excluir
	• Exclusão é definitiva (sem soft-delete).
	• Exige confirmação para o prestador.
	• Não afeta cliente diretamente.
	• Item sai imediatamente da lista.

### 6) Visualização Diária
Ao abrir o app:
	• Carrega lista do dia atual.
	• Inclui agendados, concluídos, cancelados.
	• Concluídos sempre abaixo dos agendados.
	• Cancelados sempre abaixo dos concluídos.

Navegação diária:
	• Mudar de dia → carrega todos daquele dia.

Paginação:
	• Nenhuma. Apenas scroll quando overflow.

### 7) Notificações
Internas:
	• Podem existir (ex.: alerta de atraso) — ainda a definir.

Externas:
	• WhatsApp opcional.
	• Somente se cliente possuir telefone cadastrado.
	• Disparo automático ou manual? (pendente de definição na seção "Notificações").

---
## USE CASE — UC01 — Criar Agendamento

### 1. Objetivo
Registrar um novo agendamento futuro para um cliente (ou cliente avulso), em horário disponível, garantindo consistência temporal e prevenção de conflito.

### 2. Ator Primário
Prestador autenticado no sistema.

### 3. Pré-Condições
	• Usuário está autenticado.
	• Usuário pertence a um prestador válido/ativo.
	• Data dentro da janela permitida (0 → +14 dias).
	• Horário alvo livre (sem outro agendamento iniciando naquele horário exato).
	• Serviço associado é válido.

### 4. Pós-Condições
Um registro de agendamento é criado com:
	• data
	• horário inicial
	• status = Agendado
	• cliente associado (ou walk-in)
	• serviço associado
	• duração prevista (se existir)
Agenda do dia é reordenada cronologicamente.
Histórico (audit) registra operação de criação.

### 5. Fluxo Principal (Sucesso)
1. Ator abre tela do dia.
2. Ator seleciona "novo agendamento".
3. Ator preenche: cliente / serviço / data / horário.
4. Sistema verifica janela temporal válida.
5. Sistema verifica ausência de conflito de horário.
6. Sistema estima duração prevista (se serviço possuir).
7. Sistema cria o registro.
8. Sistema aplica ordenação cronológica do dia.
9. Sistema registra evento no histórico.
10. Sistema retorna sucesso.
11. Sistema renderiza agendamento na lista.

### 6. Fluxos Alternativos
A1 — Serviço sem duração definida:
	• Sistema cria agendamento sem duração prevista.
	• Nenhum alerta é mostrado.
	• Retorna ao passo 8 do principal.

A2 — Cliente avulso:
	• Sistema coleta nome rápido (walk_in_name).
	• Associa ao agendamento como `client_type = WalkIn`.
	• Retorna ao passo 7 do principal.

### 7. Fluxos de Falha
F1 — Data fora da janela:
	• Sistema bloqueia criação, informa limite de +14 dias.
F2 — Data passada:
	• Sistema bloqueia criação.
F3 — Conflito de horário:
	• Sistema bloqueia criação. Mensagem: "horário indisponível".
F4 — Serviço inválido:
	• Sistema bloqueia criação.
F5 — Usuário não autenticado:
	• Sistema redireciona para login.

### 8. Regras de Negócio Vinculadas
RB-AG-01: status inicial = Agendado
RB-AG-02: não criar agendamento em data passada
RB-AG-03: janela máxima = 14 dias
RB-AG-04: impedir conflito de horário
RB-AG-05: duração prevista é opcional
RB-AG-06: audit log obrigatório

### 9. Dados Persistidos
appointment:
	• client_id (nullable se WalkIn)
	• service_id
	• date
	• start_time
	• expected_duration_min (nullable)
	• status = "AGENDADO"
audit_event:
	• type = "CREATE"
	• timestamp
	• user_id
	• appointment_id

---
## USE CASE — UC02 — Iniciar Atendimento

### 1. Objetivo
Registrar o início real de execução de um atendimento previamente agendado, atualizando o status e recalculando a dinâmica temporal dos demais atendimentos do dia, quando necessário.

### 2. Ator Primário
Prestador autenticado.

### 3. Pré-Condições
	• Prestador autenticado.
	• Agendamento existe.
	• Status atual = Agendado.
	• Data do atendimento é a mesma data do dia atual.
	• real_start_time ainda não existe.
	• Serviço associado existe.
	• Horário real pode estar antes ou depois do horário marcado — permitido.

### 4. Pós-Condições
	• Agendamento passa ao status Iniciado.
	• Sistema grava timestamp real de início.
	• Sistema reordena agenda do dia, se necessário.
	• Sistema recalcula horários futuros quando houver impacto.
	• Sistema registra evento de auditoria.

### 5. Fluxo Principal (Sucesso)
1. Ator seleciona um agendamento.
2. Ator toca em "Iniciar".
3. Sistema registra horário real do início (agora).
4. Sistema altera status para "Iniciado".
5. Sistema recalcula horários futuros se necessário.
6. Sistema reordena lista visual.
7. Sistema registra evento no histórico.
8. Sistema confirma sucesso visualmente.

### 6. Fluxos Alternativos
A1 — Atendimento iniciado antes do horário marcado:
	• Sistema registra início adiantado.
	• Sistema libera o horário que estava reservado.
	• Sistema recalcula agenda futura.
	• Volta ao fluxo principal passo 6.

A2 — Atendimento iniciado após horário marcado:
	• Sistema registra início atrasado.
	• Sistema atualiza cálculo de atraso.
	• Sistema ajusta próximos horários.
	• Volta ao fluxo principal passo 6.

### 7. Fluxos de Falha
F1 — Agendamento com status diferente de Agendado:
	• Sistema bloqueia ação.
	• Mensagem: "Não é possível iniciar este atendimento".
	• Nenhuma gravação.
F2 — Agendamento pertence a outra data:
	• Sistema bloqueia.
	• Mensagem clara.
	• Nenhuma gravação.
F3 — Usuário não autenticado:
	• Sistema impede ação.
	• Encaminha para login.
	• Atenção: iniciar não pode falhar silenciosamente — sempre exige feedback.

### 8. Regras de Negócio Vinculadas
RB-AG-10: somente agendamentos do dia podem ser iniciados
RB-AG-11: iniciar registra timestamp real obrigatório
RB-AG-12: iniciar ajusta agenda futura quando necessário
RB-AG-13: reordenação automática após iniciar
RB-AG-14: evento audit é obrigatório

### 9. Dados Persistidos
appointment:
	• started_at
	• status = "in_progress"
audit_event:
	• type = "started"
	• timestamp
	• appointment_id
	• user_id

---
## USE CASE — UC03 — Concluir Atendimento

### 1. Objetivo
Registrar o término real de um atendimento previamente iniciado, calculando a duração real e consolidando o encerramento operacional do agendamento.

### 2. Ator Primário
Prestador autenticado.

### 3. Pré-Condições
	• Prestador autenticado.
	• Agendamento existe.
	• Status atual = Iniciado.
	• Data do agendamento é a atual.
	• Horário real de início está armazenado.

### 4. Pós-Condições
	• Status passa a Concluído.
	• Hora real de término é registrada.
	• Duração real é calculada automaticamente.
	• Registro é congelado (não pode voltar a Agendado, nem ser movido).
	• Registro aparece na seção de concluídos do dia.
	• Evento de auditoria é gravado.

### 5. Fluxo Principal (Sucesso)
1. Ator seleciona o agendamento ativo.
2. Ator aciona "Concluir".
3. Sistema captura timestamp real do término.
4. Sistema calcula duração real: real_duration = end_real - start_real.
5. Sistema altera status para "Concluído".
6. Sistema salva informações.
7. Sistema reordena lista separando concluídos dos agendados.
8. Sistema registra auditoria.
9. Sistema confirma sucesso visual.
10. Sistema atualiza dashboard diário (se existir).

### 6. Fluxos Alternativos
A1 — Sem duração prevista no serviço:
	• Sistema calcula duração real mesmo assim.
	• Nenhum aviso.
	• Fluxo retorna ao passo 7 do Principal.

### 7. Fluxos de Falha
F1 — Status ≠ Iniciado:
	• Sistema bloqueia ação.
	• Mostra mensagem clara.
	• Nenhuma gravação.
F2 — Horário real de início ausente:
	• Sistema alerta erro interno.
	• Nenhuma gravação.
F3 — Usuário não autenticado:
	• Ação negada.
	• Encaminha para login.

### 8. Regras de Negócio Vinculadas
RB-AG-20: apenas agendamentos iniciados podem ser concluídos
RB-AG-21: conclusão registra horário real de término
RB-AG-22: cálculo de duração real é obrigatório
RB-AG-23: agendamento concluído não pode ser reaberto
RB-AG-24: agendamento concluído não participa mais de reordenação ativa
RB-AG-25: audit é obrigatório

### 9. Dados Persistidos
appointment:
	• ended_at
	• real_duration_min
	• status = "done"
audit_event:
	• type = "finished"
	• timestamp
	• appointment_id
	• user_id

---
## USE CASE — UC04 — Cancelar Agendamento

### Propósito
Permitir encerrar antecipadamente um agendamento ainda não iniciado ou em andamento, interrompendo a execução planejada e liberando o horário na agenda.

### Atores
	• Primário: Operador interno / proprietário (Prestador)
	• Secundário: Sistema Agenda (calendário / notificador)

### Pré-condições
	• Agendamento existe.
	• Status atual ∈ {Scheduled, InProgress}.
	• Usuário autenticado.

### Garantias de Sucesso (Success Guarantees)
	• Sistema registra o cancelamento.
	• Nenhuma outra informação é alterada indevidamente.

### Disparadores
	• Usuário executa a ação "Cancelar".

### Fluxo Principal (Basic Flow)
1. Usuário solicita cancelamento do agendamento.
2. Sistema valida existência do agendamento.
3. Sistema valida status permitido para cancelamento.
4. Sistema registra cancelamento (status = Canceled).
5. Sistema grava `canceledAt`.
6. Sistema libera o horário (slot) para novos agendamentos.
7. Sistema confirma cancelamento ao usuário.

### Fluxos Alternativos (Extensões)
A1 — Agendamento não encontrado:
	• Passo 2a: Sistema informa que o agendamento não existe.
	• Passo 2b: Caso de uso termina.

A2 — Status não permite cancelamento:
	• Passo 3a: Sistema recusa e informa motivo.
	• Passo 3b: Caso de uso termina.

A3 — Erro de persistência:
	• Passo 4a: Sistema registra falha de I/O/banco.
	• Passo 4b: Sistema retorna mensagem de erro genérica.
	• Passo 4c: Caso de uso termina.

### Regras de Negócio Vinculadas
RN04.01 – Condição de cancelamento: somente Scheduled ou InProgress podem ser cancelados.
RN04.02 – Registro temporal obrigatório: gravar `canceledAt`.
RN04.03 – Imutabilidade de histórico: cancelamento não remove histórico; fim não é delete.
RN04.04 – Liberação do slot: slot volta a estado livre no calendário interno.

### Indicadores Derivados
	• % cancelamentos por operador
	• % cancelamentos por horário
	• Média de antecedência do cancelamento (canceledAt - startAt planejado)

Justificativa técnica: indicadores suportam inferência de padrões e melhoria de capacidade (referência: Sommerville, 10ª ed., métricas operacionais).

---
## USE CASE — UC05 — Excluir Agendamento (Administrativo)

### Propósito
Remover um agendamento do ponto de vista operacional e visual do sistema, sem romper histórico e integridade relacional.

### Atores
	• Primário: Operador interno / administrador
	• Secundário: Sistema Agenda

### Pré-condições
	• Agendamento existe.
	• Usuário possui permissão administrativa para exclusão.
	• Agendamento em qualquer status exceto InProgress (não excluir em execução).

### Garantias Mínimas
	• Registros históricos preservados.
	• Consistência da agenda mantida.
	• Integridade relacional preservada.

### Disparador
	• Administrador seleciona "Excluir".

### Fluxo Principal
1. Administrador solicita exclusão.
2. Sistema valida permissões.
3. Sistema valida elegibilidade (status ≠ InProgress).
4. Sistema marca agendamento como "Deleted" (soft delete).
5. Sistema grava `deletedAt`.
6. Sistema remove agendamento das listas operacionais e calendário.
7. Sistema confirma ao administrador.

### Fluxos Alternativos
A1 — Usuário sem permissão:
	• (Passo 2a) Sistema rejeita operação (falta de permissão).
	• (Passo 2b) Caso termina.

A2 — Registro não existe:
	• (Passo 2c) Sistema informa inexistência.
	• (Passo 2d) Caso termina.

A3 — Status não elegível:
	• (Passo 3a) Sistema informa que não pode excluir devido ao status atual.
	• (Passo 3b) Caso termina.

A4 — Falha ao persistir:
	• (Passo 4a) Sistema registra falha.
	• (Passo 4b) Sistema retorna erro genérico.
	• (Passo 4c) Caso termina.

### Regras de Negócio Vinculadas
RN05.01 – Exclusão não apaga dados críticos (preservar histórico).
RN05.02 – Restrição de permissão (somente administrativo).
RN05.03 – Soft Delete obrigatório (não remove fisicamente).
RN05.04 – Bloqueio de status em execução (InProgress não pode excluir).

### Indicadores Derivados
	• % de exclusões administrativas por período
	• Motivos de exclusão (quando coletados)
	• Tempo médio entre criação e exclusão

Observação: coleta de "motivo" pode ser opcional (campo audit adicional) para enriquecer métricas.

---
## USE CASE — UC06 — Reagendar Agendamento

### Propósito
Alterar data / horário / serviço preservando histórico e mantendo regras de disponibilidade e integridade da fila.

### Atores
	• Prestador (autenticado)
	• Sistema Agenda

### Pré-condições
	• Agendamento existe.
	• Status ∉ {InProgress, Done} (não reagendar em execução ou concluído).
	• Usuário possui permissão para operar na agenda.
	• Nova data/hora proposta é futura e dentro dos limites (≤ 14 dias).

### Disparador
	• Prestador solicita mudança de data e/ou hora de um agendamento existente.

### Fluxo Principal
1. Prestador solicita reagendamento.
2. Sistema exibe formulário com horário atual e horários disponíveis.
3. Prestador define nova data e/ou novo horário (e opcionalmente novo serviço).
4. Sistema valida: limite futuro, não retroativo, ausência de conflito de horário.
5. Sistema aplica mudanças.
6. Sistema salva novo horário preservando histórico (mantém original arquivado).
7. Sistema registra `rescheduledAt`.
8. Sistema confirma ao prestador.
9. Sistema recalcula previsão e fila futura, quando aplicável.

### Fluxos Alternativos
A1 — Novo horário inválido:
	• (Passo 4a) Sistema informa regra violada e aborta.
A2 — Conflito com outro agendamento:
	• (Passo 4b) Sistema bloqueia e informa indisponibilidade.
A3 — Falha de persistência:
	• (Passo 5a) Sistema registra falha e aborta.
A4 — Usuário perde permissão no meio da operação:
	• (Passo 4c) Sistema revoga operação.

### Regras de Negócio Vinculadas
RN06.01 — Proibição retroativa (não reagendar para datas passadas).
RN06.02 — Limite de janela futura (≤ 14 dias).
RN06.03 — Exclusividade de horário (sem duplicidade temporal exata).
RN06.04 — Preservação de histórico (guardar data/hora original).
RN06.05 — Propagação de fila (recalcular fila e previsões posteriores).

### Notas Importantes (dinâmica temporal)
A literatura de Operational Research em agenda dinâmica mostra que reagendamentos impactam lead time, service level e distribuição de waiting time (Little’s Law em teoria de filas). Ignorar esses efeitos degrada previsões e experiência do usuário ao longo do tempo.

### Dados Persistidos
appointment:
	• scheduled_start_at (novo valor)
	• previous_start_at (valor anterior preservado)
	• rescheduled_at (timestamp da operação)
	• status (inalterado, geralmente 'scheduled')
audit_event:
	• type = "rescheduled"
	• antes/depois (snapshot horário)
	• user_id
	• appointment_id

### Indicadores Derivados
	• Contagem de reagendamentos por dia
	• % de reagendamentos sobre total de agendamentos
	• Tempo médio de antecedência do reagendamento (scheduled_start_at - rescheduled_at)
	• Variação média em minutos (scheduled_start_at - previous_start_at)
	• Impacto acumulado em minutos na fila (soma das variações sucessivas)

---
## USE CASE — UC07 — Editar Agendamento (Dados Complementares)

### 1. Propósito
Permitir ajustes em informações não temporais de um agendamento existente, sem modificar data, hora ou status, mantendo estabilidade da fila e integridade temporal.

### 2. Atores
Primário: Prestador (autenticado)
Secundário: Sistema Agenda

### 3. Pré-Condições
	• Agendamento existe.
	• Prestador autenticado.
	• Status ∉ {canceled, done}.
	• Campos de data/hora/status não estão sendo alterados.

### 4. Disparador
Prestador solicita modificar dados complementares de um agendamento já criado.

### 5. Escopo da Edição (Campos Permitidos)
Somente campos administrativos / auxiliares:
	• notas_internas
	• notas_cliente
	• walk_in_name / telefone (quando client_type = WalkIn)
	• tags[] internas
	• prioridade_manual (enum ou inteiro)
	• marcacoes_administrativas (ex.: pre_chegada, lembrete)
	• anexos (referências de arquivos)
	• forma_pagamento_planejada
	• pendencia_financeira_marcacao (flag administrativa)

Observação: nenhuma mudança que altere logística temporal (scheduled_start_at, expected_duration_min) ou fluxo de status.

### 6. Fluxo Principal (Sucesso)
1. Prestador acessa o agendamento.
2. Prestador seleciona "Editar".
3. Sistema exibe formulário com campos permitidos.
4. Prestador altera os campos desejados.
5. Sistema valida conteúdo (formato, tamanho, coerência business rules).
6. Sistema persiste alterações atômicas.
7. Sistema registra evento audit (type = "updated").
8. Sistema atualiza `atualizado_em`.
9. Sistema retorna confirmação.

### 7. Fluxos Alternativos
A1 — Agendamento concluído ou cancelado:
	• Sistema bloqueia (mensagem de imutabilidade) e encerra.
A2 — Tentativa de alteração de campo proibido (tempo/status):
	• Sistema rejeita payload e orienta uso de UC06 (reagendar) ou ações de status.
A3 — Validação falha (ex.: tamanho excedido, formato inválido):
	• Sistema informa erros e mantém tela aberta para correção.
A4 — Falha de persistência (DB/IO):
	• Sistema registra erro e retorna mensagem genérica; nenhuma mudança aplicada (rollback).

### 8. Regras de Negócio Vinculadas
RN07.01 — Imutabilidade temporal (UC07 não altera scheduled_start_at / expected_duration_min).
RN07.02 — Imutabilidade de status (UC07 não altera status).
RN07.03 — Log de integridade (audit obrigatório em toda edição).
RN07.04 — Permissão (somente prestador autenticado).
RN07.05 — Sem impacto na fila (não recalcula ordem nem horários projetados).
RN07.06 — Validação de escopo (payload só com campos permitidos).

### 9. Dados Persistidos
appointment:
	• campos administrativos alterados (subset dos permitidos)
	• atualizado_em (timestamp)
audit_event:
	• type = "updated"
	• antes/depois (diff apenas dos campos alterados)
	• user_id
	• appointment_id

### 10. Indicadores Derivados
	• Frequência média de edições por agendamento
	• Campos mais editados (top N)
	• Taxa de tentativa de edição bloqueada (por status final)
	• Tempo médio entre criação e primeira edição
	• Correlação entre número de edições e probabilidade de cancelamento (estudo futuro)

### 11. Critério Científico / Referência
A literatura (Davis & LaGanga, 2011; Gupta & Denton, 2008) sustenta separação entre edição administrativa e manipulação temporal para reduzir erros de coordenação e preservar estabilidade operacional. Evitar mistura de eixos críticos (tempo/status) com dados auxiliares diminui ambiguidade e melhora confiabilidade do sistema de agenda.