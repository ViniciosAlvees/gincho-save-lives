# Revisão de Front-End - Global Solution 2026/2

Revisão em 12/11/2026 do repositório local, comparado ao PDF fornecido: regras gerais nas páginas 7, 11, 13-17 e Front-End Design Engineering nas páginas 58-74. Os requisitos do documento foram usados como critérios de avaliação da parte solicitada, sem ampliar o escopo para implementar as outras disciplinas.

## Resultado

O frontend tem a estrutura e os fluxos demonstrativos principais, mas **a entrega ainda não está completa**. A API Java remota, a Vercel, o vídeo, os links definitivos e a participação do grupo no Git continuam pendentes. Não é possível garantir nota nem ausência de penalidades antes de conferir a versão publicada e o ZIP final.

| Critério do PDF | Situação constatada |
|---|---|
| React + Vite + TypeScript; organização e tipos (10 pts) | Presentes. Build e checagem TypeScript executados sem erro. |
| Componentes, cinco páginas institucionais e duas da solução; rotas estáticas e com parâmetro (10 pts) | Presentes em `src/App.tsx`; `PageHero`, `Notice` e outros componentes reaproveitados. Menu e rodapé incluem Integrantes. Acesso direto remoto ainda depende do deploy. |
| Tailwind e três resoluções oficiais (8 pts) | Configuração, utilitários e breakpoints presentes. Não atribuir pontuação integral sem revisar visualmente 390 × 844, 768 × 1024 e 1440 × 900. O acesso ao navegador automatizado estava indisponível nesta revisão. |
| Integração com Java (18 pts) | Corrigido o frontend para exibir o GET e enviar POST pelo formulário em modo API, com estados e erros. Java remoto e contrato definitivo não fornecidos; requisito real ainda pendente. |
| Formulários e UX (7 pts) | Validações e mensagens presentes. Formulário remoto preparado, mas feedback precisa ser demonstrado com a API real. |
| Vercel (7 pts) | `vercel.json` presente; nenhuma URL de deploy comprovada. Configuração não equivale a publicação. |
| GitHub, README e vídeo (10 pts) | README atualizado e URL recuperada do remote; visibilidade pública não comprovada. Vídeo e URLs de Vercel/API faltam. |
| Apresentação (30 pts) | Responsabilidade do grupo, com participação oral de todos; não verificável pelo código. |

Mesmo que sua tarefa seja somente frontend, a rubrica dessa disciplina exige consulta e escrita reais na API Java. A equipe responsável pelo backend deve fornecer o servidor; o frontend deve demonstrar que o consome.

## Correções desta revisão

- A listagem remota passou a mostrar os dados retornados; antes, só informava que a conexão funcionava.
- `/solicitar-guincho` em modo API passou a enviar POST via Fetch, com validação, bloqueio durante envio, protocolo/status retornados e erro sem apagar o preenchimento.
- Cliente HTTP com timeout, credenciais de sessão e validação de resposta para evitar tela quebrada ou sucesso sem protocolo.
- `identificacao.txt` incluído com os dados já presentes no projeto. Conferir os nomes completos com o grupo.
- README e contrato atualizados; mocks não foram apresentados como integração concluída.

## Penalidades específicas - página 73

| Situação | Penalidade do PDF | Verificação local |
|---|---|---|
| ZIP maior que 50 MB | -2 pontos | Nenhum ZIP final foi fornecido. Medir o arquivo final. |
| `node_modules` dentro do ZIP | -3 pontos | Existe na máquina, como esperado; não deve entrar no ZIP. `.gitignore` não filtra compactação manual. |
| Arquivos essenciais ausentes | -10 pontos | Código, configurações, lockfile e assets presentes; build passou. Conferir novamente após extrair o ZIP. |
| Axios ou outra biblioteca HTTP em lugar de Fetch | -10 pontos | Nenhuma biblioteca HTTP desse tipo encontrada nas dependências/código próprio. Requisições em Fetch. |
| Só links, sem ZIP no Portal | Nota zero | Envio é responsabilidade do representante. |
| Template pronto como base substancial | Nota zero | Nenhum template identificado na inspeção; a origem/autoria completa não pode ser certificada apenas pelo código local. |
| Tecnologia proibida substituindo React + Vite | Nota zero | Não identificada. O projeto usa as tecnologias exigidas. |
| Projeto incompatível com a proposta | Nota zero | Solução de mobilidade relacionada a CitizenTech; manter coerência com as demais entregas. |
| Plágio ou trabalho substancialmente idêntico | Nota zero + ocorrência | Não é possível certificar ausência por inspeção local. README registra a origem das fotos e dados dos integrantes e o auxílio de IA. O grupo deve revisar e dominar o código. |

Falta de API, deploy, vídeo ou commits também compromete os pontos dos respectivos critérios; não confundir esses itens com as penalidades adicionais da tabela. Não somar descontos hipotéticos nem tratar este relatório como nota oficial.

## Pendências antes de entregar

1. Confirmar o cadastro do grupo até **13/11/2026**. Grupo não cadastrado não aparece no portal de entrega (páginas 14-15).
2. Obter URL pública da API Java, alinhar contrato/CORS/autenticação e testar GET exibindo dados e POST gravando no servidor, seguido de nova consulta. Nenhum mock atende esse requisito (páginas 62 e 67).
3. Publicar na Vercel e testar navegação, refresh nas rotas e integração remota. Atualizar README com as URLs definitivas.
4. Conferir os três tamanhos oficiais, inclusive menu, formulários, mapas e Integrantes; ausência de rolagem horizontal sozinha não comprova ausência de cortes.
5. Confirmar GitHub público. Antes deste commit de revisão, o histórico local tinha **5 commits, todos de ViniciosAlvees**. O PDF pede cinco por integrante e quinze no total: com cinco pessoas são pelo menos **25 commits**, cada um feito pelo autor real.
6. Gravar vídeo público ou não listado no **YouTube, até três minutos**, mostrando aplicação e API. Não usar como limite os cinco minutos do pitch de outra disciplina. Atualizar o README com vídeo e contato.
7. Reforçar a explicação CitizenTech com beneficiários, ecossistema e como medir o impacto. ODS 9 e 11 já aparecem na página Sobre; detalhar as metas e a contribuição proposta sem inventar impacto comprovado.
8. Preparar ZIP de até 50 MB com `src`, assets, `index.html`, `package.json`, `package-lock.json`, configurações Vite/TypeScript/ESLint/Vercel, `.env.example`, README, docs e `identificacao.txt`. Excluir `node_modules`, `.git`, arquivos `.env` com segredos, caches e arquivos temporários. Extrair em pasta limpa e seguir o README.
9. O representante deve anexar o ZIP no Portal do Aluno até **19/11/2026 às 23h55**. Preparar a apresentação de **23 a 27/11**, com todos participando e explicando o código.

## Validação e limites

`npm run lint`, `npm run test` (16 testes em quatro arquivos) e `npm run build` verificam código e contrato do cliente. Os testes de API usam respostas controladas, identificadas como tal, e não comprovam Java/Oracle ou publicação. Nesta revisão não houve submissão no Portal, publicação externa ou gravação de vídeo. A inspeção visual nas resoluções oficiais permanece pendente.
