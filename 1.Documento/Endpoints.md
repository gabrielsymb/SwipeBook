## Endpoints REST (Base Minimalista)

Importante:
• Recorte base (não exaustivo)
• Foco em clareza e controle de escopo
• Verbos HTTP padronizados (POST cria, GET lê, PUT substitui/atualiza, PATCH ação pontual, DELETE remove/desativa)

Formato da listagem:
MÉTODO ROTA DESCRIÇÃO

---

1. AUTENTICAÇÃO / SESSÃO (`/auth`)

---

| POST | /auth/register | cria usuário |
| POST | /auth/login | cria sessão e devolve token |
| POST | /auth/logout | invalida token |
| GET | /auth/me | retorna dados do usuário autenticado |

---

2. CLIENTES (`/clients`)
   | GET | /clients | lista (paginação + filtros: nome, pendencia, ativo) |
   | POST | /clients | cria cliente |
   | GET | /clients/{id} | detalhe |
   | PUT | /clients/{id} | atualiza dados |
   | DELETE | /clients/{id} | desativa (soft-delete) |

---

3. SERVIÇOS / CATÁLOGO (`/services`)

---

| GET | /services | lista serviços |
| POST | /services | cria serviço |
| GET | /services/{id} | detalhe |
| PUT | /services/{id} | atualiza |
| DELETE | /services/{id} | remove |

---

4. AGENDAMENTOS (`/appointments`)

---

| GET | /appointments | lista (filtros: data, status, cliente) |
| POST | /appointments | cria agendamento |
| GET | /appointments/{id} | detalhe |
| PUT | /appointments/{id} | atualiza dados funcionais (data, serviço, cliente) |
| PATCH | /appointments/{id}/start | inicia execução |
| PATCH | /appointments/{id}/finish | encerra execução |
| PATCH | /appointments/{id}/cancel | cancela |
| PATCH | /appointments/{id}/reschedule | reagenda data/hora/serviço preservando histórico |
| PATCH | /agendamentos/{id}/reorder | altera somente a ordem (position_key LexoRank) |
| DELETE | /appointments/{id} | remove (se permitido) |

---

5. FINANCEIRO (opcional) (`/payments`, `/invoices`)

---

PAYMENTS
| GET | /payments | lista pagamentos |
| POST | /payments | cria pagamento |
| GET | /payments/{id} | detalhe |
| PUT | /payments/{id} | atualiza |
| DELETE | /payments/{id} | remove |

INVOICES
| GET | /invoices | lista faturas |
| POST | /invoices | cria fatura |
| GET | /invoices/{id} | detalhe |
| PUT | /invoices/{id} | atualiza |
| DELETE | /invoices/{id} | remove |

---

6. CONFIGURAÇÕES GERAIS (opcional) (`/settings`)

---

| GET | /settings | obtém configurações |
| PUT | /settings | atualiza configurações |

Notas futuras:
• Considerar PATCH em /clients/{id} para atualizações parciais.
• Possível /appointments/{id}/reorder ou endpoint batch para reorder múltiplo.
• Pagamentos/invoices podem exigir versionamento ou estados (draft, paid, canceled).

Corpos (JSON) relevantes:

POST /appointments
{
"client_type": "Person" | "WalkIn",
"cliente_id": "<uuid>" | null,
"walk_in_name": "string opcional se WalkIn",
"servico_id": "<uuid>",
"scheduled_start_at": "2024-04-05T14:30:00Z",
"expected_duration_min": 30
}

PUT /appointments/{id}
{
"servico_id": "<uuid>",
"scheduled_start_at": "2024-04-05T15:00:00Z",
"expected_duration_min": 45,
"cliente_id": "<uuid>",
"walk_in_name": null
}

PATCH /appointments/{id}/reschedule
{
"scheduled_start_at": "2024-04-06T10:00:00Z",
"servico_id": "<uuid opcional se alterar serviço>"
}

Resposta típica (GET /appointments/{id})
{
"id": "<uuid>",
"client_type": "Person",
"cliente_id": "<uuid>",
"walk_in_name": null,
"servico_id": "<uuid>",
"status": "scheduled",
"scheduled_start_at": "2024-04-05T14:30:00Z",
"expected_duration_min": 30,
"started_at": null,
"ended_at": null,
"real_duration_min": null,
"canceled_at": null,
"deleted_at": null,
"rescheduled_at": null,
"previous_start_at": null,
"position_key": "b~3", // chave lexical para ordem do dia
"version": 1,
"criado_em": "2024-04-01T12:00:00Z",
"atualizado_em": "2024-04-01T12:00:00Z"
}
