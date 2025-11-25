## Entidades e Campos Essenciais

### Visão Geral
Principais entidades do domínio para o MVP. Campos de auditoria padrão (`criado_em`, `atualizado_em`). UUID como chave primária. Controle de concorrência otimista em `Agendamento` via `version`.

---------------------------------------------------------------------------
1. PRESTADOR (Provider) — entidade de autenticação e dona da agenda
---------------------------------------------------------------------------
| Campo         | Tipo     | Obrigatório | Observações                       |
|---------------|----------|-------------|-----------------------------------|
| id            | UUID     | sim         | identificador primário            |
| nome          | string   | sim         | exibição                          |
| email         | string   | sim         | único                             |
| senha_hash    | string   | sim         | nunca armazenar senha bruta       |
| ativo         | boolean  | sim         | bloqueio de acesso                |
| plano/licença | string   | opcional    | versão futura                     |
| timezone      | string   | sim         | essencial para agenda             |
| criado_em     | datetime | sim         | auditoria                         |
| atualizado_em | datetime | sim         | auditoria                         |

---------------------------------------------------------------------------
2. CLIENTE (Customer) — pertence a um Prestador
---------------------------------------------------------------------------
| Campo         | Tipo     | Obrigatório | Observações                          |
|---------------|----------|-------------|--------------------------------------|
| id            | UUID     | sim         | primário                             |
| prestador_id  | UUID     | sim         | FK (agenda do dono)                  |
| nome          | string   | sim         | identificação                        |
| telefone      | string   | opcional    | facilita confirmação                 |
| email         | string   | opcional    |                                      |
| pendencia     | boolean  | sim         | indica pendência financeira (inad.)  |
| criado_em     | datetime | sim         |                                      |
| atualizado_em | datetime | sim         |                                      |

---------------------------------------------------------------------------
3. SERVIÇO (Service) — definido por cada Prestador
---------------------------------------------------------------------------
| Campo         | Tipo     | Obrigatório | Observações                          |
|---------------|----------|-------------|--------------------------------------|
| id            | UUID     | sim         |                                      |
| prestador_id  | UUID     | sim         | cada profissional define os seus     |
| nome          | string   | sim         | corte, barba, etc                    |
| preço         | decimal  | sim         | usado no cálculo diário              |
| duração_min   | int      | opcional    | permite projeção de agenda           |
| criado_em     | datetime | sim         |                                      |
| atualizado_em | datetime | sim         |                                      |

---------------------------------------------------------------------------
4. AGENDAMENTO (Appointment) — entidade mais crítica
---------------------------------------------------------------------------
| Campo               | Tipo           | Obrigatório | Observações                                                             |
|---------------------|----------------|-------------|---------------------------------------------------------------------------|
| id                  | UUID           | sim         | primário                                                                 |
| prestador_id        | UUID           | sim         | FK                                                                       |
| client_type         | enum           | sim         | 'Person' | 'WalkIn'                                                        |
| cliente_id          | UUID           | condicional | FK — obrigatório se client_type = 'Person'                               |
| walk_in_name        | string         | condicional | obrigatório se client_type = 'WalkIn'                                    |
| servico_id          | UUID           | sim         | FK                                                                       |
| status              | enum           | sim         | scheduled, in_progress, done, canceled, deleted                          |
| scheduled_start_at  | datetime       | sim         | data + hora inicialmente marcada                                          |
| expected_duration_min | int         | opcional    | derivado do serviço; usado para projeção                                  |
| started_at          | datetime       | opcional    | quando iniciou realmente                                                  |
| ended_at            | datetime       | opcional    | quando terminou realmente                                                 |
| real_duration_min   | int            | opcional    | calculado: (ended_at - started_at) em minutos                             |
| canceled_at         | datetime       | opcional    | preenchido no cancelamento                                                |
| deleted_at          | datetime       | opcional    | preenchido na exclusão (soft delete)                                      |
| rescheduled_at      | datetime       | opcional    | quando houve alteração de data/hora                                       |
| previous_start_at   | datetime       | opcional    | último horário antes do reagendamento                                     |
| position_index      | numeric/string | sim         | ordenação manual na lista                                                 |
| version             | int            | sim         | controle de concorrência                                                  |
| criado_em           | datetime       | sim         |                                                                           |
| atualizado_em       | datetime       | sim         |                                                                           |

Notas:
	• `position_index` existe para suportar reorder.
	• `version` evita conflito quando dois dispositivos atualizam simultaneamente.
	• `expected_duration_min` auxilia cálculo de atraso/adiantamento.
	• `previous_start_at` preserva histórico para auditoria em reagendamentos.
	• `client_type` define vínculo com Cliente:                       
		- Se 'WalkIn': `cliente_id` deve ser nulo e `walk_in_name` informado.
		- Se 'Person': `cliente_id` obrigatório e `walk_in_name` nulo.

---------------------------------------------------------------------------
5. APPOINTMENT HISTORY (Auditoria) — registra mudanças importantes
---------------------------------------------------------------------------
| Campo          | Tipo     | Obrigatório | Observações                                                                 |
|----------------|----------|-------------|---------------------------------------------------------------------------------|
| id             | UUID     | sim         |                                                                                 |
| appointment_id | UUID     | sim         | FK                                                                              |
| ação           | enum     | sim         | created, updated, status_changed, repositioned, started, finished, canceled, deleted, rescheduled |
| antes          | json     | opcional    | snapshot                                                                        |
| depois         | json     | opcional    | snapshot                                                                        |
| usuário        | string   | opcional    | quem fez (usuário ou sistema)                                                   |
| criado_em      | datetime | sim         |                                                                                 |

Função:
	• Permite reconstruir histórico
	• Permite relatório financeiro retroativo
	• Protege contra erro humano