# GUINCHO SAVE LIVES

**Tecnologia que conecta. Agilidade que faz a diferença.**

Protótipo Front-End da Global Solution 2026/2 da FIAP (CitizenTech). Conecta, em uma experiência demonstrativa local, motoristas que precisam de guincho a profissionais da região. **Não é um serviço real de emergência, transporte, pagamento ou comunicação entre dispositivos.**

## Tecnologias

React, Vite, TypeScript, Tailwind CSS, React Router, Leaflet e OpenStreetMap. HTTP futuro exclusivamente pela Fetch API. Sem backend neste repositório.

## Executar

Requisitos: Node.js 20.19+ ou 22.12+ e npm.

```bash
npm install
npm run dev
```

O modo padrão é `demo` mesmo sem `.env`. Para preparar as variáveis, copie `.env.example` para `.env` (no PowerShell: `Copy-Item .env.example .env`). Abra o endereço exibido pelo Vite.

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

## Funcionalidades

- Home cinematográfica com guincho ilustrado, estrada e rota animadas, parallax sutil, opção de pular e respeito a `prefers-reduced-motion`.
- Busca por região, distância aproximada em linha reta, disponibilidade, veículo, preço e avaliação; mapa interativo com marcadores fictícios. Geolocalização somente após ação do usuário.
- Cadastro e login demonstrativos de clientes e guincheiros, com CPF validado e mascarado, senha apenas em memória durante o formulário e sessão local em memória (perdida ao recarregar). A senha do login demo não é verificada: **não há autenticação real**.
- Cadastro profissional em quatro etapas, pré-visualização temporária de JPG/PNG/PDF (até 5 MB) e quatro documentos fictícios para concluir o fluxo. Arquivos reais não são enviados nem persistidos. Aprovação demonstrativa por funcionário, com status e bloqueios de disponibilidade/chamados.
- Painel de funcionários com acesso demonstrativo separado, indicadores, análise documental ilustrativa, histórico e decisões confirmadas em modal. O PIN real depende do backend; nenhuma credencial fixa está no navegador.
- Solicitação em cinco etapas; propostas, contraproposta, aceitação/recusa, chat local, acompanhamento e histórico.
- Painel do guincheiro com região, disponibilidade e avaliações refletidas na busca. Apenas perfis aprovados e disponíveis podem ser contratados; clientes precisam de conta demo ativa e sessão para solicitar ou negociar.
- Avaliações de 1 a 5 estrelas vinculadas a atendimento concluído, uma por chamado; média e distribuição calculadas dos registros.
- Formulários com validação e feedback. Páginas institucionais e FAQ.

Os perfis iniciais, coordenadas, avaliações e preços são **fictícios/ilustrativos**. O cadastro profissional usa coordenadas ilustrativas até existir geocodificação/integração real. O armazenamento local do navegador pode ser limpo pelo usuário.

## Identidade visual e créditos

O redesign usa CSS/Tailwind e componentes React próprios, sem template. A ilustração transparente em `src/assets/hero-tow-truck-blue.png` foi editada com OpenAI ImageGen a partir de `src/assets/hero-tow-truck.png`; não é fotografia nem representa veículo da operação. Prompt final da edição: “Replace every fluorescent lime-green trim accent on the tow truck with electric blue and icy cyan. Keep the original truck, proportions, pose, camera angle, dark graphite paint, wheels, lighting, composition, and genuinely transparent background unchanged. No text, logo, road or background.” Os mapas utilizam dados fictícios sobre tiles do OpenStreetMap, com atribuição visível na interface.

Os efeitos interativos respeitam `prefers-reduced-motion`, ponteiro por toque e foco visível. O menu e as funções demonstrativas permanecem disponíveis sem animação.

## Estrutura

- `src/components`: layout, mapa, animação e componentes reutilizáveis.
- `src/pages`: páginas e fluxos da SPA.
- `src/contexts`: estado do modo demonstração.
- `src/mocks`: dados fictícios identificados.
- `src/services`: contrato comum e providers `demo` (local) e `api` (Fetch).
- `src/types`: contratos TypeScript.
- `src/utils`: formatação e distância.
- `docs`: contrato proposto, matriz, pendências e roteiro.

## Equipe e entrega

A página `/integrantes`, disponível no menu e no rodapé, apresenta os cinco integrantes com foto, RM, turma, LinkedIn e GitHub. Os dados e as fotos foram obtidos do [repositório indicado pela equipe](https://github.com/alvesdemacedoenzo-beep/challenge-front-end-fiap/tree/ab68687687319ec60cab98737dc10b34fca58f44), em `src/data/site.ts` e `src/assets/team/`. As fotos estão incluídas localmente em `src/assets/team/` e os perfis em `src/data/team.ts`.

| Integrante | RM | Turma |
|---|---|---|
| Raphael Ferreira Tavares | 569767 | 1TDSPY |
| Bryan Germano | 569716 | 1TDSPY |
| Enzo Macedo | 569427 | 1TDSPY |
| Victor Hugo Velasco Guzman | 573173 | 1TDSPY |
| Vinicios Alves | 573002 | 1TDSPY |

Funções no projeto: **pendentes de confirmação pela equipe**. Repositório público GitHub: **link pendente**. Deploy Vercel: **link pendente**. Vídeo YouTube (até três minutos): **link pendente**. Canal de contato oficial: **pendente**.

A FIAP exige **mínimo de 15 commits no total e 5 por integrante**. Cada pessoa deve realizar seus próprios commits; não falsifique autoria. O ZIP final (até 50 MB, sem `node_modules`) deve ser entregue no Portal do Aluno até **19/11/2026 às 23h55**, conforme a especificação fornecida.

## API Java e Vercel

A integração real com Java/Oracle está **pendente** e é responsabilidade dos demais integrantes. As camadas `src/services/towService.ts` e `src/services/platformService.ts` definem operações futuras via Fetch; o segundo contrato é provisório e não é chamado no modo demonstração. Configure `VITE_APP_MODE=api` e `VITE_API_BASE_URL` apenas quando o contrato e servidor estiverem disponíveis. O modo API mostra loading, erro e vazio sem cair silenciosamente nos mocks; as telas de escrita do modo API ainda aguardam o contrato definitivo. Veja [contrato proposto](docs/contrato-api.md) e [pendências](docs/integracao-pendente.md).

O arquivo `vercel.json` configura fallback de rotas SPA para acesso direto. O deploy ainda não foi realizado.

## Limitações e declaração de IA

Sem autenticação/autorização real, armazenamento seguro de documentos, cobrança, roteamento rodoviário, ETA real, mensagens entre dispositivos ou backend. O painel administrativo demo não protege dados reais; use apenas dados fictícios. Não use para atendimentos reais. Este Front-End foi desenvolvido com auxílio de IA (OpenAI Codex); a equipe deve revisar código, validações, conteúdo e entrega antes da submissão. A implementação não substitui o trabalho de integração Java, a apresentação presencial ou o vídeo.
