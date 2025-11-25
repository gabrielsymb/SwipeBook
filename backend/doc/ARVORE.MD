meu-projeto-backend/
├── src/backend
│   ├── config/                           # Configurações gerais / setup
│   ├── controles/                        # Camada HTTP: valida entrada e delega (Controllers)
│   │   ├── AppointmentController.ts      # Recebe dados, valida formato, chama serviço
│   │   └── ClientController.ts           # Idem para clientes
│   ├── servicos/                         # Regras de negócio (Use Cases / Services)
│   │   ├── CreateAppointmentService.ts   # Regra: criar agendamento (ex: não pode data passada)
│   │   └── StartAppointmentService.ts    # (Movido de controles/ para cá — antes inconsistente)
│   ├── repositorios/                     # Acesso a dados (SQL / ORMs / Repositories)
│   │   └── AppointmentRepository.ts
│   ├── rotas/                            # Registro das rotas (ex: index.ts / router.ts)
│   ├── servidor/                         # Bootstrap do servidor (ex: server.ts / app.ts)
│   ├── doc/                              # Documentação interna (.MD)
│   │   └── ARVORE.MD
│   └── .env                              # Variáveis de ambiente (opcional manter na raiz)
├── .env                                  # Alternativa: fora de /src
├── .gitignore                            # Arquivos ignorados pelo Git
└── package.json                          # Metadados e dependências

Responsabilidades resumidas:
- Controller (controles/): Apenas verifica se os dados de entrada estão corretos (tipos, campos obrigatórios) e encaminha para o serviço.
- Service (servicos/): Onde ficam as regras de negócio (ex: "não pode agendar data passada").
- Repository (repositorios/): Código de acesso a dados (SQL, queries, ORM). Nenhuma regra de negócio aqui.

Diagnóstico rápido de bugs:
- Se aceitou algo que a regra proíbe (ex: agendar no passado) → olhar servicos/.
- Se erro de banco (ex: tabela não existe, coluna errada) → olhar repositorios/.

Notas:
- Padronizado idioma para PT-BR (antes misto).
- StartAppointmentService.ts movido para servicos/ (correta separação Controller vs Service).
- Avaliar se servidor/ deve manter nome server/ se preferir