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

O provider `demo` usa armazenamento local, compartilhado com o React Context. Em modo `api`, `/buscar-guincho` exibe a lista recebida de `GET /guincheiros`, `/guincheiros/:id` seleciona o profissional dessa lista e `/solicitar-guincho` envia `POST /solicitacoes`. O formulário exibe o protocolo e o status devolvidos pelo servidor; campos são preservados em caso de erro. As demais áreas aguardam seus contratos específicos.

O GET deve retornar um array JSON de `Professional` (IDs em string), inclusive `[]` para vazio. O POST deve retornar o objeto `TowRequest` criado, incluindo `id` e `status`; um 204 não confirma esse fluxo. Respostas incompatíveis geram mensagem de erro. As chamadas enviam cookies com `credentials: include` e têm timeout de 15 segundos. O backend deve definir autenticação, autorizar cada operação e configurar CORS para a origem exata do frontend com credenciais. Não colocar segredos em variáveis `VITE_*`. Se o Java usar paginação, nomes diferentes ou token Bearer, ajustar este contrato e o cliente antes da entrega.

Esses fluxos foram testados com respostas controladas; **não comprovam integração com Java remoto**. Demonstrar a gravação real e uma consulta posterior ao servidor, sem mocks, antes de marcar o requisito como concluído.
