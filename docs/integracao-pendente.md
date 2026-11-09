# Integração pendente

- API Java real (18 pontos da matriz): endpoints GET/POST/PUT, autenticação/autorização, validação, concorrência e persistência Oracle.
- Substituição do armazenamento local por dados remotos, sem fallback silencioso para mocks no modo API.
- Chat entre dispositivos, notificações e atualização em tempo real.
- Localização/geocodificação confiável, rotas rodoviárias e estimativas reais — não são exibidas no protótipo.
- Verificação de guincheiros, preços reais, contato e pagamentos (fora do escopo atual).
- Confirmação dos integrantes, RMs, turma, links GitHub/Vercel/YouTube e contato oficial.
- Deploy público na Vercel, vídeo e apresentação presencial. `vercel.json` já prepara o fallback SPA.
- Revisão final de acessibilidade, privacidade e validação com a API e dispositivos reais.
- Autenticação real de cliente, guincheiro e funcionário, sessão segura, autorização por recurso e validação de status no servidor. O PIN de oito dígitos não deve ser validado no bundle do navegador.
- Armazenamento privado de CNH, RG frente/verso e foto facial; upload autenticado, antivírus, limites de tamanho, retenção e acesso auditado. O modo demo não persiste arquivos reais.
- Validação server-side de aprovação antes de disponibilidade/propostas e de avaliação após atendimento concluído, uma por chamado e pelo cliente vinculado. Endpoints provisórios em `src/services/platformService.ts` dependem de acordo com a equipe.
