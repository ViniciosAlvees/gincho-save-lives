# Contrato de API proposto — pendente de alinhamento

Este documento é uma **proposta** para integração futura com a API Java Spring Boot. Endpoints, autenticação, campos, erros e paginação definitivos dependem dos colegas responsáveis. Nenhum backend está incluído aqui.

Base: `VITE_API_BASE_URL`; respostas JSON; erros HTTP não são substituídos por mocks. O cliente atual está em `src/services/towService.ts` e utiliza somente Fetch API.

| Método | Caminho proposto | Objetivo |
|---|---|---|
| GET | `/guincheiros` | Listar profissionais/filtros futuros |
| PUT | `/guincheiros/{id}` | Atualizar região/disponibilidade |
| GET | `/solicitacoes` | Listar chamados |
| POST | `/solicitacoes` | Criar chamado |
| PUT | `/solicitacoes/{id}` | Atualizar status/dados permitidos |
| POST | `/solicitacoes/{id}/propostas` | Criar proposta |
| PUT | `/solicitacoes/{id}/propostas/{propostaId}` | Negociar/aceitar/recusar |

Modelos TypeScript: `Professional`, `TowRequest`, `Proposal`, `ChatMessage`, `NewRequest` em `src/types/index.ts`. Contrato de serviços: `TowService` em `src/services/towService.ts`.

## Pontos a decidir com o backend

- Identidade/autorização reais por perfil; proibir manipulação de chamados alheios.
- IDs, enumerações de status, validação de transições no servidor e concorrência transacional para impedir duas confirmações simultâneas.
- Filtros, paginação, formatos de erro, timezone e CORS.
- Dados de localização e privacidade; geocodificação e roteamento são serviços separados.
- Estratégia de chat real (polling, SSE ou WebSocket), não implementada neste protótipo.
- Contrato de telefone/WhatsApp e consentimento.

O provider `demo` usa armazenamento local, compartilhado com o React Context para o fluxo demonstrativo. O provider `api` atual faz GET de guincheiros para verificar a conexão, mostra loading/erro/vazio e bloqueia os fluxos de escrita até o contrato real. Não declara integração concluída.
