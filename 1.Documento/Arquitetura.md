ARQUITETURA — DIAGRAMA TEXTUAL (MVP)
OBS! o uso de tipagem declarada é essencial
com ressalvas para alguns casos que não seja
viável - tudo tem que ter tipo explicito
Sempre usar tipagem estática/declarada

- COMENTÁRIOS DETALHADOS EM PORTUGUÊS -
  (pt-br) nas funções, métodos e
  lógicas de negócio cruciais
  (especialmente nos arquivos Service e Repository)
  explicando o que está sendo feito e por quê.

Legenda:
▲ fluxo de chamada para baixo
┴ acoplamento via interface / boundary
HTTP/REST apenas entre Cliente -> Aplicação

┌────────────────────────────────────────────────────────────────┐
│ CAMADA CLIENTE │
│ (Front-end PWA) │
│----------------------------------------------------------------│
│ Tecnologias / Capacidades: │
│ • React SPA (mobile-first) │
│ • Drag & Drop no calendário e lista │
│ • Swipe lateral (ações rápidas) │
│ • UI otimista (optimistic UI) │
│ • Cache local (Service Worker) │
│ • IndexedDB (dados offline) │
│ │
│ Responsabilidades: │
│ • Capturar input do usuário │
│ • Renderização visual │
│ • Aplicar reorder imediato na UI │
│ • Disparar operações (API calls) │
│ • Sincronização offline → online │
├──────────────────────────────────────────────▲─────────────────┤
│ HTTP/REST │
└──────────────────────────────────────────────┴─────────────────┘
▲
│ chama
│
┌──────────────────────────────────────────────┬─────────────────┐
│ CAMADA DE APLICAÇÃO (Backend / Use Cases) │
│----------------------------------------------------------------│
│ Orquestração / Serviços de Aplicação: │
│ • Orquestra regras de negócio │
│ • Valida comandos do cliente │
│ • Controla transações │
│ • Notifica domínio e repositórios │
│ │
│ Casos de Uso (MVP): │
│ • Criar Agendamento │
│ • Cancelar Agendamento │
│ • Marcar como Concluído │
│ • Reordenar Agendamento (reorder) │
│ • Apuração do dia │
│ │
│ Não faz: │
│ ✘ HTML │
│ ✘ Acesso direto ao banco │
│ ✘ Política de UI │
├──────────────────────────────────────────────▲─────────────────┤
│ Interfaces (Ports) │
└──────────────────────────────────────────────┴─────────────────┘
▲
│ invoca regras puras
│
┌──────────────────────────────────────────────┬─────────────────┐
│ CAMADA DE DOMÍNIO (Core) │
│----------------------------------------------------------------│
│ Entidades: │
│ • Prestador • Cliente • Serviço • Agendamento │
│ │
│ Regras críticas: │
│ • Restrição de status (fluxo válido) │
│ • Cálculo de apuração │
│ • Política de reorder (cálculo de chave lexical) │
│ • Geração de histórico │
│ │
│ Características: │
│ • Não conhece banco, HTTP ou UI │
│ • Parte mais estável do sistema │
├──────────────────────────────────────────────▲─────────────────┤
│ Interfaces (Repositories) │
└──────────────────────────────────────────────┴─────────────────┘
▲
│ implementa
│
┌────────────────────────────────────────────────────────────────┐
│ CAMADA DE INFRAESTRUTURA (Adapters) │
│----------------------------------------------------------------│
│ Tecnologias / Componentes: │
│ • Postgres │
│ • Repositórios concretos │
│ • Migrations e seeds │
│ • Log estruturado │
│ • Auditoria │
│ │
│ Responsabilidades: │
│ • Implementar interfaces dos repositórios │
│ • Persistir entidades │
│ • Garantir consistência e transações │
│ • Consultas otimizadas │
│ • Versionamento para concorrência │
│ • Ordenação por LexoRank (position_key) usando fractional-indexing │
│ - Chave lexical (String) calculada com generateKeyBetween(before, after) │
│ - Índice único composto: (prestador_id, data_agendada, position_key) │
│ - Sem bulk update de posições; reorder é O(1) (apenas UPDATE do item) │
│ │
│ Não define a lógica de negócio │
└────────────────────────────────────────────────────────────────┘
Scheduled → Adiar. Foco imediato no fluxo de vida principal (Create → Start → Finish) e nas transições complexas (Reschedule, Reorder). Ordenação diária: primária por data_agendada ASC e secundária por position_key ASC (LexoRank). Reorder altera apenas a position_key; mudanças de horário são feitas pelo Reschedule.
Auditoria precisa guardar usuário? Sim, mas não agora. No momento, guarde apenas o prestador_id (que será injetado pelo middleware de autenticação). A expansão de auditoria será para before/after snapshots e action enum.
