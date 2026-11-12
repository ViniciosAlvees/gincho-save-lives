# Matriz de requisitos FIAP — status honesto

| Critério | Pontos | Evidência no Front-End | Status |
|---|---:|---|---|
| React/Vite/TypeScript | 10 | `package.json`, `vite.config.ts`, `src/` | Implementado |
| Componentes, páginas e rotas | 10 | `src/App.tsx`, `src/pages/`, `src/components/` | Implementado |
| Tailwind e responsividade | 8 | `src/index.css`, classes utilitárias e breakpoints | Implementado; verificação visual nas três resoluções permanece pendente nesta revisão |
| API Java: GET, escrita, serviços e estados | 18 | `src/services/towService.ts`, `src/pages/ApiModePage.tsx`: lista GET exibida e formulário POST preparado | **Pendente integração real**; testes com respostas controladas não substituem Java |
| Formulários e UX | 7 | Cadastros, contato, wizard, proposta, chat | Implementado em modo demo |
| Deploy Vercel | 7 | `vercel.json` | Configuração pronta; deploy pendente |
| GitHub, README e vídeo | 10 | README e `docs/roteiro-video.md` | README/roteiro prontos; repositório público/vídeo pendentes |
| Apresentação presencial | 30 | A ser realizada pela equipe | Pendente |
| **Total** | **100** | | |

Verificar nos tamanhos oficiais: **390 × 844**, **768 × 1024**, **1440 × 900**. A exigência Git é de **15 commits no total, 5 por integrante**, feitos pelos próprios autores. ZIP final até 50 MB, sem `node_modules`, com código, configurações, assets e README. Entrega até **19/11/2026, 23h55** no Portal do Aluno.

Com cinco integrantes, o mínimo por pessoa exige pelo menos 25 commits. Incluir também `identificacao.txt` no ZIP (regra geral da página 15 do PDF). Consulte [revisão detalhada e penalidades](revisao-frontend.md).
