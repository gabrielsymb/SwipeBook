## Tratamento de Erros

Guia padronizado para classificação, resposta e métricas de erros no módulo de agendamento.

### 1. Classificação

| Código | Categoria           | Definição                                           |
|--------|---------------------|-----------------------------------------------------|
| E-IN   | Erros de Entrada    | Falhas de preenchimento pelo usuário.              |
| E-BIZ  | Erros de Negócio    | Violam regras de negócio documentadas.             |
| E-TIME | Erros de Temporalidade | Violam lógica de tempo ou janela permitida.   |
| E-CFLT | Erros de Conflito   | Colisão de horário ou concorrência simultânea.     |
| E-PERM | Erros de Permissão  | Acesso ou operação não autorizada.                 |
| E-TECH | Erros Técnicos      | Falhas externas: rede, timeout, exceções.           |
| E-SYNC | Erros de Sincronização | Divergência entre cliente e servidor.         |

#### 1.1 Erros de Entrada (E-IN)
Exemplos: campo obrigatório vazio; horário não selecionado; serviço ausente; cliente inválido.
Conduta: bloquear ação; destacar campos inválidos; mensagem clara específica; não persistir.

#### 1.2 Erros de Negócio (E-BIZ)
Exemplos: criar no passado; além de +14 dias; dois agendamentos mesma hora; concluir sem iniciar; iniciar já iniciado.
Conduta: bloquear; manter estado; mensagem da regra; sem gravação.

#### 1.3 Erros de Temporalidade (E-TIME)
Exemplos: iniciar de outro dia; reagendar retroativo; cancelar retroativo; concluir antes de iniciar.
Conduta: bloquear; explicar motivo temporal; manter lista intacta.

#### 1.4 Erros de Conflito (E-CFLT)
Exemplos: dois dispositivos movendo simultâneo; backend detecta conflito oculto.
Conduta: negar; sugerir refresh; forçar atualização local para consistência.

#### 1.5 Erros de Permissão (E-PERM)
Exemplos: excluir sem permissão; alterar status de agendamento alheio.
Conduta: negar; informar motivo; auditar tentativa.

#### 1.6 Erros Técnicos (E-TECH)
Exemplos: falha rede; timeout; exceção de banco; HTTP 500.
Conduta: não repetir automático; indicar falha técnica; preservar estado; permitir retry manual.

#### 1.7 Erros de Sincronização (E-SYNC)
Exemplos: lista mudou durante DnD; agendamento excluído em outro dispositivo.
Conduta: comunicar inconsistência; invalidar cache; recarregar dia.

### 2. Associação com Casos de Uso

| UC   | Categorias Prováveis                                    |
|------|---------------------------------------------------------|
| UC01 | E-IN, E-BIZ, E-TIME, E-CFLT                             |
| UC02 | E-TIME, E-BIZ                                          |
| UC03 | E-BIZ                                                  |
| UC04 | E-BIZ, E-TIME                                          |
| UC05 | E-PERM, E-BIZ                                          |
| UC06 | E-TIME, E-CFLT, E-BIZ                                  |
| UC07 | E-IN, E-BIZ                                            |

### 3. Regras Transversais
1. Nenhuma alteração de estado se o erro ocorre.
2. Nenhum audit log em falha (exceto tentativas de permissão negada → audit opcional). 
3. Mensagem sempre indica regra violada; sem jargão técnico.
4. Nunca culpar o usuário; focar na ação a corrigir.
5. Não esconder detalhes críticos (ex: horário conflitado).
6. UI retorna ao estado estável anterior.

### 4. Feedback ao Prestador
Diretrizes: claro; curto; preciso; sem códigos brutos.
Exemplo bom: “Horário indisponível. Existe outro atendimento às 14:00.”
Exemplo ruim: “Erro 409.”

### 5. Recuperação
• Manter dados preenchidos.  
• Permitir correção inline.  
• Não limpar formulário após falha.  
• Facilitar repetição da ação após ajuste.  

### 6. Métricas de Erros
Coletar: taxa de conflitos; ações recusadas por regra; erros técnicos; tentativas inválidas de início/conclusão; % operações que falham antes do sucesso.
Motivação: identificar falhas de UX ou lógica e priorizar melhorias.