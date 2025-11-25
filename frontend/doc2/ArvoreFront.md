src/frontend
│   ├── components/        # Tijolos visuais (Button, Input). Sem regras de negócio.
│   │   ├── Button.jsx
│   │   └── Input.jsx
│   ├── pages/             # As telas (layout + composição de componentes)
│   │   ├── Login/
│   │   │   └── LoginPage.jsx
│   │   └── Dashboard/
│   │       └── DashboardPage.jsx
│   ├── hooks/             # Lógica de estado das páginas (coordenam dados e chamam services)
│   │   └── useDashboard.js
│   ├── domain/            # Modelos e validações puras da UI
│   │   ├── models/
│   │   │   └── appointment.js
│   │   └── rules/         # Regras de validação local (espelho do backend)
│   │       └── appointmentRules.js
│   ├── services/          # Comunicação HTTP/Axios/Fetch. Sem regra de negócio.
│   │   └── api.js
│   ├── routes/            # Definição das rotas (React Router)
│   │   └── index.jsx
│   ├── utils/             # Funções utilitárias puras (formatters, helpers)
│   │   └── formatters.js
│   ├── styles/            # CSS global / tema
│   │   └── theme.css
│   └── App.jsx            # Entry point da aplicação (monta Router)
└── package.json

Responsabilidades (Frontend):
- components/: Apenas view. Recebem props e renderizam. NÃO conhecem regras.
- pages/: Montam a interface; delegam lógica para hooks/domain.
- hooks/: Orquestram estado, chamadas a services e aplicam validações leves.
- domain/models/: Mapeiam dados da API para a forma usada pela UI.
- domain/rules/: Validações de UX (ex: impedir selecionar data passada). Fonte de verdade continua sendo o backend.
- services/: Chamada HTTP (fetch/axios). Nunca aplicar regra de negócio aqui.
- utils/: Helpers genéricos (formatar datas, etc.). Sem acoplar a regra.
- routes/: Tabela de rotas da SPA.
- styles/: Tema e estilos globais.

Onde ficam as Regras de Negócio principais?
- Backend (pasta servicos/): ali está a regra REAL (ex: não pode agendar no passado).
- Frontend domain/rules/: Apenas espelha validações para feedback imediato ao usuário. Se o backend mudar a regra, este espelho deve ser ajustado. Sempre tratar erros vindos do backend como autoridade final.

Fluxo de validação:
1. Usuário interage → hook chama função em domain/rules para validação rápida.
2. Se passar na validação local → services/api.js envia para backend.
3. Backend confirma ou rejeita conforme regras de negócio reais.
4. Em caso de divergência, exibir mensagem retornada do backend e revisar domain/rules se necessário.

Diagnóstico de bugs:
- Erro de regra que passou indevidamente → verificar backend servicos/ primeiro.
- Erro de UI exibindo coisa errada ou bloqueando sem necessidade → revisar domain/rules/ e hooks/.
- Erro de requisição, status HTTP inesperado → services/.