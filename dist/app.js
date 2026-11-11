const STORAGE_KEY = "agmiz-authority-dashboard-v1";
const METRICS_KEY = "agmiz-authority-metrics-v1";
const PLAN_NAME = "Ágmiz 10/11/2026 a 02/02/2027";

// Migracao: tarefas que repetem artigos ja publicados no blog ficam fora do banco
// (continuam no backup local). 9: repete "Como o ChatGPT escolhe..." e o GEO 2027;
// 42: repete "SEO para Tray, Shopify, Nuvemshop..." e "VTEX vs Shopify vs Nuvemshop";
// 54: repete "Como mensurar o ROI de SEO e GEO no e-commerce".
const MIGRATION_EXCLUDE = { "9": "Repete artigos ja publicados sobre recomendacao por IA", "42": "Repete artigos ja publicados sobre plataformas", "54": "Repete o artigo ja publicado sobre ROI" };
// Status ja conhecidos no momento da migracao.
const MIGRATION_STATUS = { "1": "done", "3": "done", "14": "done" };
// Tarefas que correspondem a um conteudo do calendario com outro titulo.
const MIGRATION_CONTENT_MATCH = { "70": "Estudo, 2ª rodada: quais lojas o ChatGPT recomenda em 5 nichos" };

const channels = ["Zenodo", "Blog", "LinkedIn", "SlideShare", "YouTube", "Google Meu Negocio", "Tecnico", "Medicao"];

const seedTasks = [
  { id: 1, title: "Concluir cadastro pessoal no Zenodo", channel: "Zenodo", date: "2026-11-06", status: "progress", note: "Usar Fernanda Alencar e afiliacao AGMIZ.", type: "research" },
  { id: 2, title: "Criar ORCID e conectar ao Zenodo", channel: "Zenodo", date: "2026-11-10", status: "pending", note: "Pode ser feito depois do cadastro.", type: "research" },
  { id: 3, title: "Publicar: GEO - o que muda em 2027 para aparecer no ChatGPT", channel: "Blog", date: "2026-11-12", status: "pending", note: "Prioridade P0. Resposta principal no primeiro paragrafo.", type: "content" },
  { id: 4, title: "LinkedIn: O que e GEO em tres frases", channel: "LinkedIn", date: "2026-11-13", status: "pending", note: "Resposta na primeira linha. Assinar como Fernanda Alencar, fundadora da AGMIZ.", type: "distribution" },
  { id: 5, title: "YouTube Short: GEO em 60 segundos", channel: "YouTube", date: "2026-11-14", status: "pending", note: "Fernanda na tela e resposta nos dois primeiros segundos.", type: "distribution" },
  { id: 6, title: "Publicar: As 10 melhores estrategias de SEO para 2027", channel: "Blog", date: "2026-11-19", status: "pending", note: "Incluir o que ja nao funciona e o ponto de vista AGMIZ.", type: "content" },
  { id: 7, title: "LinkedIn: Por que seu concorrente aparece no ChatGPT e voce nao", channel: "LinkedIn", date: "2026-11-20", status: "pending", note: "Explicar sinais, fontes e autoridade com um CTA discreto.", type: "distribution" },
  { id: 8, title: "SlideShare 1: O que e GEO - guia visual", channel: "SlideShare", date: "2026-11-21", status: "pending", note: "10 a 15 slides e link rastreavel para a AGMIZ.", type: "distribution" },
  { id: 9, title: "Publicar: Como as IAs vao recomendar empresas em 2027", channel: "Blog", date: "2026-11-26", status: "pending", note: "Guia definitivo com fontes, criterios e exemplos.", type: "content" },
  { id: 10, title: "Criar linkagem interna entre os tres artigos", channel: "Tecnico", date: "2026-11-27", status: "pending", note: "Conectar pilares, servicos e auditoria gratuita.", type: "content" },
  { id: 11, title: "Solicitar indexacao dos artigos no Search Console", channel: "Tecnico", date: "2026-11-27", status: "pending", note: "Registrar a data para medir 14 e 45 dias.", type: "content" },
  { id: 12, title: "Definir metodologia do survey GEO no Brasil 2026", channel: "Zenodo", date: "2026-11-15", status: "pending", note: "Titulo deve refletir a amostra real coletada.", type: "research" },
  { id: 13, title: "Selecionar 10 clientes para o survey inicial", channel: "Zenodo", date: "2026-11-18", status: "pending", note: "Preparar convite, consentimento e perguntas.", type: "research" },
  { id: 14, title: "Definir prompts fixos para medicao em IAs", channel: "Medicao", date: "2026-11-09", status: "pending", note: "Usar sessoes novas e nao mencionar AGMIZ na pergunta.", type: "research" },
  { id: 15, title: "Configurar UTMs padrao por canal", channel: "Medicao", date: "2026-11-10", status: "pending", note: "linkedin, slideshare, youtube e zenodo.", type: "research" },
  { id: 16, title: "Preencher painel mensal de novembro", channel: "Medicao", date: "2026-11-30", status: "pending", note: "Google, IA, UTMs, auditorias, reunioes e contratos.", type: "research" },
  { id: 17, title: "SlideShare 2: SEO para e-commerce - checklist 2027", channel: "SlideShare", date: "2026-11-24", status: "pending", note: "Checklist visual com CTA para a auditoria.", type: "distribution" },
  { id: 18, title: "YouTube Short: Agencia de SEO versus consultor - qual contratar?", channel: "YouTube", date: "2026-12-05", status: "pending", note: "Comparativo de 30 segundos.", type: "distribution" },
  { id: 19, title: "Entrevistar os primeiros clientes do survey", channel: "Zenodo", date: "2026-12-12", status: "pending", note: "Registrar respostas e anonimizar os dados.", type: "research" },
  { id: 20, title: "Revisar protocolo do estudo longitudinal de GEO", channel: "Zenodo", date: "2026-12-19", status: "pending", note: "Conferir casos, periodo, linha de base, intervencoes e limitacoes.", type: "research" },
  { id: 21, title: "SlideShare 3: Como aparecer no ChatGPT - passo a passo", channel: "SlideShare", date: "2026-11-28", status: "pending", note: "Passos praticos, criterios e link para o artigo completo.", type: "distribution" },
  { id: 22, title: "YouTube Short: Tres sinais de que sua agencia de SEO e ruim", channel: "YouTube", date: "2026-11-29", status: "pending", note: "Formato lista com tres sinais verificaveis.", type: "distribution" },
  { id: 23, title: "Exportar Search Console e Analytics de novembro", channel: "Medicao", date: "2026-12-01", status: "pending", note: "Registrar paginas, consultas, canais e conversoes.", type: "research" },
  { id: 24, title: "Realizar revisao mensal de novembro", channel: "Medicao", date: "2026-12-02", status: "pending", note: "Escolher tres ativos para atualizar e proximas pautas.", type: "research" },
  { id: 25, title: "Publicar: Melhores ferramentas de GEO em 2027", channel: "Blog", date: "2026-12-03", status: "pending", note: "Comparar monitoramento, prompts, mencoes e citacoes.", type: "content" },
  { id: 26, title: "Publicar artigo curto sobre ferramentas de GEO", channel: "LinkedIn", date: "2026-12-04", status: "pending", note: "Resposta na primeira linha e link rastreavel.", type: "distribution" },
  { id: 27, title: "YouTube Short: Por que seu concorrente aparece no ChatGPT e voce nao", channel: "YouTube", date: "2026-12-06", status: "pending", note: "Explicar sinais, fontes e autoridade em formato rapido.", type: "distribution" },
  { id: 28, title: "Enviar convites para o survey GEO no Brasil", channel: "Zenodo", date: "2026-12-07", status: "pending", note: "Convidar clientes e empresas com consentimento claro.", type: "research" },
  { id: 29, title: "Concluir cinco entrevistas do survey", channel: "Zenodo", date: "2026-12-09", status: "pending", note: "Registrar respostas de forma padronizada.", type: "research" },
  { id: 30, title: "SlideShare 4: Google Meu Negocio - guia para negocios locais", channel: "SlideShare", date: "2026-12-03", status: "pending", note: "Otimizar o Perfil da Empresa no Google com orientacoes atuais.", type: "distribution" },
  { id: 31, title: "Concluir mais cinco entrevistas do survey", channel: "Zenodo", date: "2026-12-13", status: "pending", note: "Chegar a amostra inicial de 10 empresas.", type: "research" },
  { id: 32, title: "Tabular e anonimizar respostas do survey", channel: "Zenodo", date: "2026-12-14", status: "pending", note: "Criar base reproduzivel sem dados pessoais.", type: "research" },
  { id: 33, title: "Publicar: Melhores agencias de SEO para e-commerce em 2027", channel: "Blog", date: "2026-12-16", status: "pending", note: "Usar criterios verificaveis e metodologia transparente.", type: "content" },
  { id: 34, title: "Publicar dois artigos curtos de autoridade", channel: "LinkedIn", date: "2026-12-18", status: "pending", note: "Criterios para escolher agencia e sinais de servico ruim.", type: "distribution" },
  { id: 35, title: "SlideShare 5: GEO versus SEO - diferencas explicadas", channel: "SlideShare", date: "2026-12-09", status: "pending", note: "Comparativo visual sem opor as duas estrategias.", type: "distribution" },
  { id: 36, title: "YouTube Short: SEO e GEO - qual e a diferenca?", channel: "YouTube", date: "2026-12-20", status: "pending", note: "Comparativo objetivo com exemplo de e-commerce.", type: "distribution" },
  { id: 37, title: "Escrever metodologia e limitacoes do survey", channel: "Zenodo", date: "2026-12-22", status: "pending", note: "Informar amostra real, periodo e vieses.", type: "research" },
  { id: 38, title: "Redigir resultados preliminares do survey", channel: "Zenodo", date: "2026-12-23", status: "pending", note: "Separar dados, interpretacao e conclusoes.", type: "research" },
  { id: 39, title: "Criar graficos e tabelas da pesquisa", channel: "Zenodo", date: "2026-12-28", status: "pending", note: "Usar titulos e fontes compreensiveis fora do contexto.", type: "research" },
  { id: 40, title: "Preencher metricas e revisao mensal de dezembro", channel: "Medicao", date: "2026-12-30", status: "pending", note: "Comparar com a linha de base e registrar decisoes.", type: "research" },
  { id: 41, title: "Verificar indexacao e desempenho apos 30 dias", channel: "Tecnico", date: "2027-01-03", status: "pending", note: "Revisar artigos, decks e videos publicados em novembro.", type: "content" },
  { id: 42, title: "Publicar: SEO para Shopify, Nuvemshop, Tray e VTEX em 2027", channel: "Blog", date: "2027-01-05", status: "pending", note: "Comparativo tecnico por plataforma.", type: "content" },
  { id: 43, title: "Publicar dois artigos curtos sobre plataformas", channel: "LinkedIn", date: "2027-01-07", status: "pending", note: "Transformar o comparativo em respostas objetivas.", type: "distribution" },
  { id: 44, title: "SlideShare 6: Como auditar seu site em 10 minutos", channel: "SlideShare", date: "2026-12-11", status: "pending", note: "Checklist curto com link para a auditoria gratuita.", type: "distribution" },
  { id: 45, title: "YouTube Short: Como testar se o ChatGPT recomenda sua empresa", channel: "YouTube", date: "2027-01-10", status: "pending", note: "Mostrar teste simples com prompt e registro do resultado.", type: "distribution" },
  { id: 46, title: "Concluir texto completo do paper do survey", channel: "Zenodo", date: "2027-01-12", status: "pending", note: "Resumo, introducao, metodo, resultados e limitacoes.", type: "research" },
  { id: 47, title: "Revisar PDF, dados e referencias do paper", channel: "Zenodo", date: "2027-01-14", status: "pending", note: "Conferir autoria, afiliacao e consistencia dos numeros.", type: "research" },
  { id: 48, title: "Preparar metadados e palavras-chave no Zenodo", channel: "Zenodo", date: "2027-01-17", status: "pending", note: "Fernanda autora, AGMIZ afiliacao e ORCID conectado.", type: "research" },
  { id: 49, title: "Publicar pagina-resumo da pesquisa na AGMIZ", channel: "Blog", date: "2027-01-19", status: "pending", note: "Resumo citavel, metodologia, dados e CTA.", type: "content" },
  { id: 50, title: "Depositar paper e dados anonimizados no Zenodo", channel: "Zenodo", date: "2027-01-20", status: "pending", note: "Conferir arquivos e metadados antes da publicacao.", type: "research" },
  { id: 51, title: "Publicar artigo no LinkedIn com resultados do estudo", channel: "LinkedIn", date: "2027-01-22", status: "pending", note: "Fernanda como pesquisadora responsavel.", type: "distribution" },
  { id: 52, title: "SlideShare 7: Palavras-chave para e-commerce - como escolher", channel: "SlideShare", date: "2026-12-16", status: "pending", note: "Intencao, categorias, produtos e oportunidade comercial.", type: "distribution" },
  { id: 53, title: "Publicar dois Shorts com achados do estudo", channel: "YouTube", date: "2027-01-24", status: "pending", note: "Um dado por video e fonte na descricao.", type: "distribution" },
  { id: 54, title: "Publicar: Como medir o ROI de SEO e GEO em 2027", channel: "Blog", date: "2027-01-26", status: "pending", note: "Conectar busca, WhatsApp, auditorias e receita.", type: "content" },
  { id: 55, title: "Publicar artigo curto sobre ROI de SEO e GEO", channel: "LinkedIn", date: "2027-01-28", status: "pending", note: "Mostrar o que medir alem de trafego e posicao.", type: "distribution" },
  { id: 56, title: "SlideShare 8: Link building para pequenas empresas", channel: "SlideShare", date: "2026-12-19", status: "pending", note: "Estrategias realistas, riscos e criterios de qualidade.", type: "distribution" },
  { id: 57, title: "Publicar dois Shorts sobre ROI e WhatsApp", channel: "YouTube", date: "2027-01-30", status: "pending", note: "Como medir vendas que terminam fora do site.", type: "distribution" },
  { id: 58, title: "Preencher metricas e revisao mensal de janeiro", channel: "Medicao", date: "2027-01-31", status: "pending", note: "Google, IA, UTMs, auditorias, reunioes e contratos.", type: "research" },
  { id: 59, title: "Realizar revisao completa dos 90 dias", channel: "Medicao", date: "2027-02-01", status: "pending", note: "Comparar cobertura, visibilidade, autoridade, demanda e receita.", type: "research" },
  { id: 60, title: "Definir o proximo ciclo de 90 dias", channel: "Medicao", date: "2027-02-02", status: "pending", note: "Manter vencedores, atualizar ativos e remover redundancias.", type: "research" },
  { id: 61, title: "Definir metodologia do estudo com 300 prompts", channel: "Zenodo", date: "2026-11-11", status: "pending", note: "Definir modelos, categorias, amostra, criterios e forma de reproducao.", type: "research" },
  { id: 62, title: "Criar e classificar os 300 prompts do estudo", channel: "Zenodo", date: "2026-11-16", status: "pending", note: "Organizar por intencao, nicho, localidade e tipo de recomendacao.", type: "research" },
  { id: 63, title: "Executar o primeiro lote de 75 prompts no ChatGPT", channel: "Zenodo", date: "2026-11-23", status: "pending", note: "Registrar modelo, data, resposta, marcas e fontes citadas.", type: "research" },
  { id: 64, title: "Executar o segundo lote de 75 prompts no Gemini", channel: "Zenodo", date: "2026-11-25", status: "pending", note: "Usar o mesmo protocolo e registrar variacoes da resposta.", type: "research" },
  { id: 65, title: "Executar o terceiro lote de 75 prompts no Perplexity", channel: "Zenodo", date: "2026-12-02", status: "pending", note: "Registrar recomendacoes, citacoes e dominios usados como fonte.", type: "research" },
  { id: 66, title: "Executar o lote final de 75 prompts e completar a amostra", channel: "Zenodo", date: "2026-12-06", status: "pending", note: "Completar 300 observacoes seguindo o protocolo definido.", type: "research" },
  { id: 67, title: "Normalizar e tabular os resultados dos 300 prompts", channel: "Zenodo", date: "2026-12-10", status: "pending", note: "Padronizar nomes, fontes, mencoes, posicao e sentimento.", type: "research" },
  { id: 68, title: "Analisar marcas e fontes mais recomendadas pelas IAs", channel: "Zenodo", date: "2026-12-15", status: "pending", note: "Comparar frequencia, convergencia entre modelos e padroes de citacao.", type: "research" },
  { id: 69, title: "Redigir paper: como IAs recomendam agencias de SEO", channel: "Zenodo", date: "2027-01-08", status: "pending", note: "Incluir metodo reproduzivel, resultados, limitacoes e anexos.", type: "research" },
  { id: 70, title: "Publicar estudo dos 300 prompts no site e no Zenodo", channel: "Zenodo", date: "2027-01-25", status: "pending", note: "Publicar paper, dados anonimizados, DOI e pagina-resumo na AGMIZ.", type: "research" },
  { id: 71, title: "Selecionar clientes para o estudo longitudinal de GEO", channel: "Zenodo", date: "2026-12-17", status: "pending", note: "Definir casos, autorizacoes, anonimização e criterios de inclusao.", type: "research" },
  { id: 72, title: "Coletar linha de base do estudo longitudinal", channel: "Zenodo", date: "2026-12-21", status: "pending", note: "Registrar periodo anterior, visibilidade, trafego, consultas e conversoes.", type: "research" },
  { id: 73, title: "Documentar intervencoes de GEO realizadas nos casos", channel: "Zenodo", date: "2027-01-06", status: "pending", note: "Registrar paginas, entidades, dados estruturados, conteudo e datas.", type: "research" },
  { id: 74, title: "Comparar resultados antes e depois das intervencoes de GEO", channel: "Zenodo", date: "2027-01-18", status: "pending", note: "Separar correlacao, limitacoes, sazonalidade e fatores externos.", type: "research" },
  { id: 75, title: "Publicar estudo longitudinal de GEO", channel: "Zenodo", date: "2027-01-30", status: "pending", note: "Publicar estudo anonimizado com periodo, linha de base, intervencoes e limitacoes.", type: "research" },
  { id: 76, title: "LinkedIn: Cinco erros de SEO que destroem sua visibilidade nas IAs", channel: "LinkedIn", date: "2026-11-27", status: "pending", note: "Lista curta com exemplo pratico e resposta principal na abertura.", type: "distribution" },
  { id: 77, title: "LinkedIn: Como saber se uma IA recomenda sua empresa", channel: "LinkedIn", date: "2026-12-08", status: "pending", note: "Ensinar um teste simples com prompts e registro das respostas.", type: "distribution" },
  { id: 78, title: "LinkedIn: SEO ainda funciona em 2027?", channel: "LinkedIn", date: "2026-12-17", status: "pending", note: "Responder diretamente e explicar o que mudou com as buscas por IA.", type: "distribution" },
  { id: 79, title: "LinkedIn: O que torna uma empresa citavel por uma IA", channel: "LinkedIn", date: "2027-01-04", status: "pending", note: "Abordar fatos, entidades, fontes, consistencia e linguagem citavel.", type: "distribution" },
  { id: 80, title: "SlideShare 9: Schema markup - o que e e como implementar", channel: "SlideShare", date: "2026-12-23", status: "pending", note: "Exemplos de Organization, Article, Product e FAQ.", type: "distribution" },
  { id: 81, title: "SlideShare 10: Core Web Vitals - guia pratico", channel: "SlideShare", date: "2026-12-28", status: "pending", note: "Explicar metricas, diagnostico e prioridades.", type: "distribution" },
  { id: 82, title: "SlideShare 11: Como saber se o ChatGPT recomenda sua empresa", channel: "SlideShare", date: "2027-01-03", status: "pending", note: "Teste, registro e interpretacao dos resultados.", type: "distribution" },
  { id: 83, title: "SlideShare 12: SEO para VTEX - categorias, produtos e filtros", channel: "SlideShare", date: "2027-01-06", status: "pending", note: "Guia tecnico focado em arquitetura e indexacao.", type: "distribution" },
  { id: 84, title: "SlideShare 13: SEO para Shopify - checklist tecnico", channel: "SlideShare", date: "2027-01-09", status: "pending", note: "Categorias, produtos, canonicals, schema e performance.", type: "distribution" },
  { id: 85, title: "SlideShare 14: SEO para Nuvemshop - limites e oportunidades", channel: "SlideShare", date: "2027-01-12", status: "pending", note: "Mostrar o que pode ser otimizado e o que exige contorno.", type: "distribution" },
  { id: 86, title: "SlideShare 15: Trafego organico sem vendas - como diagnosticar", channel: "SlideShare", date: "2027-01-15", status: "pending", note: "Intencao, pagina, oferta, confianca e conversao.", type: "distribution" },
  { id: 87, title: "SlideShare 16: Como medir vendas organicas que terminam no WhatsApp", channel: "SlideShare", date: "2027-01-18", status: "pending", note: "UTMs, eventos, CRM e atribuicao assistida.", type: "distribution" },
  { id: 88, title: "SlideShare 17: Como os crawlers de IA acessam um site", channel: "SlideShare", date: "2027-01-21", status: "pending", note: "GPTBot, OAI-SearchBot, Google-Extended e PerplexityBot.", type: "distribution" },
  { id: 89, title: "SlideShare 18: O que uma agencia de SEO e GEO deve entregar todo mes", channel: "SlideShare", date: "2027-01-24", status: "pending", note: "Entregas, indicadores, evolucao e sinais de qualidade.", type: "distribution" },
  { id: 90, title: "SlideShare 19: Metodo RESPOSTA da AGMIZ", channel: "SlideShare", date: "2027-01-27", status: "pending", note: "Apresentar as oito etapas e exemplos de aplicacao.", type: "distribution" },
  { id: 91, title: "SlideShare 20: Melhor agencia de SEO para e-commerce no Rio de Janeiro", channel: "SlideShare", date: "2027-01-30", status: "pending", note: "Apresentar criterios de escolha sem afirmacoes absolutas sem prova.", type: "distribution" },
  { id: 92, title: "Configurar linha editorial do Perfil da Empresa no Google", channel: "Google Meu Negocio", date: "2026-11-09", status: "pending", note: "Definir CTA, UTMs, imagens e frequencia quinzenal.", type: "distribution" },
  { id: 93, title: "Google: O que e GEO e por que empresas precisam se preparar", channel: "Google Meu Negocio", date: "2026-11-15", status: "pending", note: "Post original e curto com link para o artigo completo.", type: "distribution" },
  { id: 94, title: "Google: Divulgar a auditoria gratuita de SEO e IA", channel: "Google Meu Negocio", date: "2026-11-22", status: "pending", note: "Beneficio claro, imagem propria e link com UTM.", type: "distribution" },
  { id: 95, title: "Google: Por que um site aparece no Google mas nao gera leads", channel: "Google Meu Negocio", date: "2026-11-29", status: "pending", note: "Reaproveitar o artigo publicado com uma resposta nova e local.", type: "distribution" },
  { id: 96, title: "Google: Como saber se o ChatGPT recomenda sua empresa", channel: "Google Meu Negocio", date: "2026-12-06", status: "pending", note: "Ensinar um teste simples e apontar para a auditoria.", type: "distribution" },
  { id: 97, title: "Google: Como colocar uma empresa no Top 3 do Google Maps", channel: "Google Meu Negocio", date: "2026-12-13", status: "pending", note: "Adaptar o artigo de clinicas para uma orientacao empresarial ampla.", type: "distribution" },
  { id: 98, title: "Google: Avaliacoes e sinais de confianca nas buscas locais", channel: "Google Meu Negocio", date: "2026-12-20", status: "pending", note: "Conteudo educativo sem incentivar avaliacoes artificiais.", type: "distribution" },
  { id: 99, title: "Google: SEO ainda funciona com inteligencia artificial?", channel: "Google Meu Negocio", date: "2026-12-27", status: "pending", note: "Responder na primeira frase e linkar o artigo ja publicado.", type: "distribution" },
  { id: 100, title: "Google: Dados estruturados ajudam Google e IAs a entender o site", channel: "Google Meu Negocio", date: "2027-01-03", status: "pending", note: "Explicacao simples com exemplo e link para o guia.", type: "distribution" },
  { id: 101, title: "Google: Tenho trafego no e-commerce mas nao vendo", channel: "Google Meu Negocio", date: "2027-01-10", status: "pending", note: "Diagnostico curto com CTA para avaliacao gratuita.", type: "distribution" },
  { id: 102, title: "Google: Como funciona o Metodo RESPOSTA da AGMIZ", channel: "Google Meu Negocio", date: "2027-01-17", status: "pending", note: "Apresentar o metodo com foco no beneficio para empresas.", type: "distribution" },
  { id: 103, title: "Google: Principais achados do estudo com 300 prompts", channel: "Google Meu Negocio", date: "2027-01-26", status: "pending", note: "Publicar dados reais somente depois da conclusao do estudo.", type: "distribution" }
];

let tasks = loadLocalTasks();
let activeView = "overview";
let currentCalendarMonth = new Date(2026, 10, 1);
let cloudConnected = false;
let supabaseClient = null;
let authorityContext = null;
let migrationPreview = null;

function loadLocalTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!stored) return seedTasks.map(task => ({ ...task }));
    const existing = new Map(stored.map(task => [task.id, task]));
    return seedTasks.map(task => existing.has(task.id) ? { ...task, status: existing.get(task.id).status } : task)
      .concat(stored.filter(task => !seedTasks.some(seed => seed.id === task.id)));
  } catch { return seedTasks.map(task => ({ ...task })); }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  renderAll();
}

function formatDate(dateString, short = false) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", short ? { day: "2-digit", month: "short" } : { day: "2-digit", month: "long" }).format(date);
}

function isPublished(task) {
  return task.status === "done" && ["Blog", "LinkedIn", "SlideShare", "YouTube", "Zenodo"].includes(task.channel);
}

function toggleTask(id) {
  const task = tasks.find(item => item.id === id);
  task.status = task.status === "done" ? "pending" : "done";
  saveTasks();
  persistTaskStatus(task);
}

function setStatus(id, status) {
  const task = tasks.find(item => item.id === id);
  task.status = status;
  saveTasks();
  persistTaskStatus(task);
}

function renderOverview() {
  const completed = tasks.filter(t => t.status === "done").length;
  const percent = Math.round((completed / tasks.length) * 100) || 0;
  const today = "2026-11-05";
  const weekEnd = "2026-11-12";
  const dueToday = tasks.filter(t => t.status !== "done" && t.date <= today).length;
  const dueWeek = tasks.filter(t => t.status !== "done" && t.date > today && t.date <= weekEnd).length;
  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressRing").style.setProperty("--progress", `${percent * 3.6}deg`);
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("todayCount").textContent = dueToday;
  document.getElementById("todayHint").textContent = dueToday ? "pedem atencao" : "Nenhuma pendencia";
  document.getElementById("weekCount").textContent = dueWeek;
  document.getElementById("publishedCount").textContent = tasks.filter(isPublished).length;
  document.getElementById("navPending").textContent = tasks.filter(t => t.status !== "done").length;

  const upcoming = tasks.filter(t => t.status !== "done").sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  document.getElementById("priorityList").innerHTML = upcoming.map(task => `
    <article class="priority-item">
      <button class="task-check ${task.status === "done" ? "done" : ""}" data-toggle="${task.id}" aria-label="Concluir tarefa"><i data-lucide="check"></i></button>
      <div><h4>${escapeHtml(task.title)}</h4><p>${task.channel} · ${escapeHtml(task.note || "Sem observacao")}</p></div>
      <span class="due-badge">${formatDate(task.date, true)}</span>
    </article>`).join("");

  document.getElementById("channelProgress").innerHTML = channels.slice(0, 6).map(channel => {
    const items = tasks.filter(t => t.channel === channel);
    const done = items.filter(t => t.status === "done").length;
    const pct = items.length ? Math.round(done / items.length * 100) : 0;
    return `<div class="channel-row"><div class="channel-label"><span>${channel}</span><span>${done}/${items.length}</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>`;
  }).join("");
}

function renderTasks() {
  const query = document.getElementById("taskSearch").value.toLowerCase();
  const channel = document.getElementById("channelFilter").value;
  const month = document.getElementById("monthFilter").value;
  const status = document.getElementById("statusFilter").value;
  const filtered = tasks.filter(task => {
    const textMatch = `${task.title} ${task.note}`.toLowerCase().includes(query);
    return textMatch && (channel === "all" || task.channel === channel) && (month === "all" || task.date.startsWith(month)) && (status === "all" || task.status === status);
  }).sort((a, b) => a.date.localeCompare(b.date));

  document.getElementById("taskSummary").innerHTML = `<span class="summary-chip">${filtered.length} tarefas</span><span>${filtered.filter(t => t.status === "done").length} concluidas</span>`;
  document.getElementById("taskList").innerHTML = filtered.length ? filtered.map(task => `
    <article class="task-card ${task.status === "done" ? "completed" : ""}">
      <button class="task-check ${task.status === "done" ? "done" : ""}" data-toggle="${task.id}" aria-label="Alternar conclusao"><i data-lucide="check"></i></button>
      <div><h3>${escapeHtml(task.title)}</h3><div class="task-meta"><span class="channel-tag">${task.channel}</span><span><i data-lucide="calendar"></i> ${formatDate(task.date)}</span><span>${escapeHtml(task.note || "")}</span></div></div>
      <select class="status-select" data-status-id="${task.id}" aria-label="Status da tarefa"><option value="pending" ${task.status === "pending" ? "selected" : ""}>Pendente</option><option value="progress" ${task.status === "progress" ? "selected" : ""}>Em andamento</option><option value="done" ${task.status === "done" ? "selected" : ""}>Concluido</option></select>
    </article>`).join("") : `<div class="empty-state">Nenhuma tarefa encontrada com estes filtros.</div>`;
}

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  document.getElementById("calendarMonthTitle").textContent = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(currentCalendarMonth).replace(/^./, char => char.toUpperCase());
  let html = weekdays.map(day => `<div class="weekday">${day}</div>`).join("");
  const start = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1, 12);
  start.setDate(start.getDate() - start.getDay());
  for (let i = 0; i < 42; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const iso = date.toISOString().slice(0, 10);
    const dayTasks = tasks.filter(t => t.date === iso);
    html += `<div class="calendar-day ${date.getMonth() !== currentCalendarMonth.getMonth() ? "muted" : ""} ${iso === "2026-11-05" ? "today" : ""}"><span class="day-number">${date.getDate()}</span>${dayTasks.slice(0, 3).map(task => `<div class="calendar-event ${task.type === "research" ? "research" : task.type === "distribution" ? "distribution" : ""}">${escapeHtml(task.title)}</div>`).join("")}</div>`;
  }
  grid.innerHTML = html;
}

function loadMetrics() {
  try {
    const data = JSON.parse(localStorage.getItem(METRICS_KEY));
    if (!data) return;
    document.querySelectorAll("[data-metric]").forEach(input => { if (data[input.dataset.metric] !== undefined) input.value = data[input.dataset.metric]; });
    document.getElementById("aiImpressionsCard").textContent = data.aiImpressions ?? 66;
  } catch {}
}

function collectMetrics() {
  const data = {};
  document.querySelectorAll("[data-metric]").forEach(input => data[input.dataset.metric] = Number(input.value || 0));
  return data;
}

function applyMetrics(data = {}) {
  document.querySelectorAll("[data-metric]").forEach(input => {
    if (data[input.dataset.metric] !== undefined) input.value = data[input.dataset.metric];
  });
  document.getElementById("aiImpressionsCard").textContent = data.aiImpressions ?? 66;
  localStorage.setItem(METRICS_KEY, JSON.stringify(data));
}

function saveMetrics() {
  const data = collectMetrics();
  localStorage.setItem(METRICS_KEY, JSON.stringify(data));
  document.getElementById("aiImpressionsCard").textContent = data.aiImpressions;
  showToast("Metricas mantidas no backup local por enquanto.");
}

function setCloudStatus(status, label) {
  const button = document.getElementById("cloudStatusButton");
  const icon = status === "connected" ? "cloud-check" : status === "syncing" ? "cloud-upload" : status === "error" ? "cloud-alert" : "cloud-off";
  button.className = `cloud-status ${status === "local" ? "" : status}`;
  button.innerHTML = `<i data-lucide="${icon}"></i><span id="cloudStatusText">${label}</span>`;
  if (window.lucide) lucide.createIcons();
}

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  const config = window.SUPABASE_CONFIG;
  if (!config?.url || !config?.publishableKey || !window.supabase) {
    throw new Error("Configuracao do Supabase indisponivel.");
  }
  supabaseClient = window.supabase.createClient(config.url, config.publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return supabaseClient;
}

function normalizeTitle(value) {
  return String(value || "")
    .replace(/^(publicar\s*:\s*|linkedin\s*:\s*|youtube short\s*:\s*|slideshare\s*\d*\s*:\s*|google\s*:\s*)/i, "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function contentTitle(task) {
  return task.title
    .replace(/^(Publicar\s*:\s*|LinkedIn\s*:\s*|YouTube Short\s*:\s*|SlideShare\s*\d*\s*:\s*|Google\s*:\s*)/i, "")
    .trim();
}

function contentTypeForTask(task) {
  if (task.channel === "Blog" && /^Publicar/i.test(task.title)) return "artigo";
  if (task.channel === "LinkedIn") return /artigo/i.test(task.title) ? "linkedin_artigo" : "linkedin";
  if (task.channel === "SlideShare") return "slideshare";
  if (task.channel === "YouTube") return "video";
  if (task.channel === "Google Meu Negocio" && !/^Configurar linha editorial/i.test(task.title)) return "gmn";
  if (task.channel === "Zenodo" && /^(publicar|depositar)/i.test(task.title)) return "zenodo";
  return null;
}

function weekForDate(date, weeks) {
  const ordered = [...weeks].sort((a, b) => a.week_start.localeCompare(b.week_start));
  const direct = ordered.find(week => {
    const end = new Date(`${week.week_start}T12:00:00`);
    end.setDate(end.getDate() + 6);
    return date >= week.week_start && date <= end.toISOString().slice(0, 10);
  });
  if (direct) return direct;
  if (date < ordered[0].week_start) return ordered[0];
  return [...ordered].reverse().find(week => week.week_start <= date) || ordered.at(-1);
}

async function loadAuthorityContext() {
  const client = getSupabaseClient();
  const { data: workspaces, error: workspaceError } = await client.from("workspaces").select("id,name").eq("name", "Ágmiz").limit(1);
  if (workspaceError) throw workspaceError;
  if (!workspaces?.length) throw new Error("Workspace Ágmiz nao encontrado para esta conta.");
  const workspace = workspaces[0];

  const { data: plans, error: planError } = await client.from("plans").select("id,name").eq("workspace_id", workspace.id).eq("name", PLAN_NAME).limit(1);
  if (planError) throw planError;
  if (!plans?.length) throw new Error("Plano de 90 dias nao encontrado.");
  const plan = plans[0];

  const [{ data: weeks, error: weeksError }, { data: contents, error: contentsError }] = await Promise.all([
    client.from("plan_weeks").select("id,week_start,theme,notes").eq("plan_id", plan.id).order("week_start"),
    client.from("content_items").select("id,week_id,title,content_type,status,kind,url,published_at").eq("plan_id", plan.id)
  ]);
  if (weeksError) throw weeksError;
  if (contentsError) throw contentsError;
  authorityContext = { workspace, plan, weeks: weeks || [], contents: contents || [] };
  return authorityContext;
}

async function prepareMigrationPreview() {
  const client = getSupabaseClient();
  const context = authorityContext || await loadAuthorityContext();
  const allLocalTasks = loadLocalTasks();
  const excludedTasks = allLocalTasks.filter(task => MIGRATION_EXCLUDE[String(task.id)]);
  const localTasks = allLocalTasks
    .filter(task => !MIGRATION_EXCLUDE[String(task.id)])
    .map(task => MIGRATION_STATUS[String(task.id)] ? { ...task, status: MIGRATION_STATUS[String(task.id)] } : task);
  const { data: existingActions, error } = await client.from("plan_actions").select("source_local_id").eq("plan_id", context.plan.id);
  if (error) throw error;
  const existingActionIds = new Set((existingActions || []).map(item => item.source_local_id));
  const contentByKey = new Map(context.contents.map(item => [`${item.week_id}|${normalizeTitle(item.title)}`, item]));

  const actions = localTasks.map(task => {
    const week = weekForDate(task.date, context.weeks);
    return {
      workspace_id: context.workspace.id,
      plan_id: context.plan.id,
      week_id: week.id,
      title: task.title,
      channel: task.channel,
      due_date: task.date,
      status: task.status,
      notes: task.note || "",
      source_local_id: String(task.id)
    };
  });

  const contentCandidates = localTasks.map(task => {
    const contentType = contentTypeForTask(task);
    if (!contentType) return null;
    const week = weekForDate(task.date, context.weeks);
    const title = contentTitle(task);
    const override = MIGRATION_CONTENT_MATCH[String(task.id)];
    const existing = override
      ? context.contents.find(item => normalizeTitle(item.title) === normalizeTitle(override))
      : contentByKey.get(`${week.id}|${normalizeTitle(title)}`);
    return { task, week, title, contentType, existing };
  }).filter(Boolean);

  migrationPreview = {
    localTasks,
    excludedTasks,
    actions,
    newActions: actions.filter(item => !existingActionIds.has(item.source_local_id)),
    contentCandidates,
    newContents: contentCandidates.filter(item => !item.existing),
    matchedContents: contentCandidates.filter(item => item.existing)
  };
  renderMigrationPreview();
  return migrationPreview;
}

function renderMigrationPreview() {
  const preview = migrationPreview;
  document.getElementById("migrationStats").innerHTML = `
    <div><strong>${preview.localTasks.length}</strong><span>tarefas locais</span></div>
    <div><strong>${preview.newActions.length}</strong><span>acoes a importar</span></div>
    <div><strong>${preview.newContents.length}</strong><span>conteudos novos</span></div>
    <div><strong>${preview.matchedContents.length}</strong><span>conteudos ja existentes</span></div>
    <div><strong>${preview.excludedTasks.length}</strong><span>repetidas, fora do banco</span></div>`;
  document.getElementById("migrationExamples").innerHTML = preview.actions.slice(0, 10).map(action => {
    const week = authorityContext.weeks.find(item => item.id === action.week_id);
    return `<div><b>${escapeHtml(action.title)}</b><span>${formatDate(week.week_start)} · ${escapeHtml(action.channel)} · ${escapeHtml(action.status)}</span></div>`;
  }).join("");
  document.getElementById("migrationDialog").showModal();
  if (window.lucide) lucide.createIcons();
}

async function importMigrationPreview() {
  if (!migrationPreview) throw new Error("Previa de migracao indisponivel.");
  const client = getSupabaseClient();
  const preview = migrationPreview;
  const insertedByKey = new Map(preview.matchedContents.map(item => [`${item.week.id}|${normalizeTitle(item.title)}`, item.existing]));
  const matchedByTask = new Map(preview.matchedContents.map(item => [String(item.task.id), item.existing]));

  if (preview.newContents.length) {
    const rows = preview.newContents.map(item => ({
      workspace_id: authorityContext.workspace.id,
      plan_id: authorityContext.plan.id,
      week_id: item.week.id,
      content_type: item.contentType,
      title: item.title,
      status: item.task.status === "done" ? "publicado" : item.task.status === "progress" ? "rascunho" : "ideia",
      kind: "novo",
      published_at: item.task.status === "done" ? item.task.date : null
    }));
    const { data, error } = await client.from("content_items").insert(rows).select("id,week_id,title");
    if (error) throw error;
    (data || []).forEach(item => insertedByKey.set(`${item.week_id}|${normalizeTitle(item.title)}`, item));
  }

  const actions = preview.actions.map(action => {
    const candidate = preview.contentCandidates.find(item => String(item.task.id) === action.source_local_id);
    const content = candidate ? (matchedByTask.get(action.source_local_id) || insertedByKey.get(`${candidate.week.id}|${normalizeTitle(candidate.title)}`)) : null;
    return { ...action, content_item_id: content?.id || null };
  });
  const { error: actionsError } = await client.from("plan_actions").upsert(actions, { onConflict: "workspace_id,source_local_id" });
  if (actionsError) throw actionsError;

  const { error: briefingError } = await client.from("content_items")
    .update({ status: "briefing" })
    .eq("plan_id", authorityContext.plan.id)
    .eq("title", "Produto saiu de linha: o que fazer com a página");
  if (briefingError) throw briefingError;

  await loadRemoteTasks();
  authorityContext = null;
  await loadAuthorityContext();
  return {
    actions: actions.length,
    contentsInserted: preview.newContents.length,
    contentsMatched: preview.matchedContents.length
  };
}

async function loadRemoteTasks() {
  const client = getSupabaseClient();
  const context = authorityContext || await loadAuthorityContext();
  const { data, error } = await client.from("plan_actions")
    .select("id,source_local_id,title,channel,due_date,status,notes,week_id,content_item_id")
    .eq("plan_id", context.plan.id)
    .order("due_date");
  if (error) throw error;
  if (data?.length) {
    tasks = data.map(item => ({
      id: Number(item.source_local_id),
      dbId: item.id,
      title: item.title,
      channel: item.channel,
      date: item.due_date,
      status: item.status,
      note: item.notes,
      type: item.content_item_id ? "content" : "research"
    }));
    renderAll();
  }
  return data || [];
}

async function connectCloud(email, password) {
  const client = getSupabaseClient();
  setCloudStatus("syncing", "Conectando...");
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  cloudConnected = true;
  setCloudStatus("connected", "Supabase conectado");
  await loadAuthorityContext();
  const remote = await loadRemoteTasks();
  if (!remote.length) await prepareMigrationPreview();
}

async function restoreSession() {
  const client = getSupabaseClient();
  const { data } = await client.auth.getSession();
  if (!data.session) return;
  cloudConnected = true;
  setCloudStatus("connected", "Supabase conectado");
  await loadAuthorityContext();
  const remote = await loadRemoteTasks();
  if (!remote.length) await prepareMigrationPreview();
}

async function disconnectCloud() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  cloudConnected = false;
  authorityContext = null;
  tasks = loadLocalTasks();
  setCloudStatus("local", "Entrar no Supabase");
  renderAll();
}

async function persistTaskStatus(task) {
  if (!cloudConnected || !task.dbId) return;
  const { error } = await getSupabaseClient().from("plan_actions").update({ status: task.status }).eq("id", task.dbId);
  if (error) {
    setCloudStatus("error", "Falha ao salvar");
    showToast(error.message);
  } else {
    setCloudStatus("connected", "Salvo no Supabase");
  }
}

function showView(view) {
  activeView = view;
  const titles = { overview: "Visao geral", tasks: "Checklist", calendar: "Calendario", metrics: "Metricas" };
  document.querySelectorAll(".view").forEach(el => el.classList.toggle("active", el.id === `${view}View`));
  document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.view === view));
  document.getElementById("viewTitle").textContent = titles[view];
  if (view === "tasks") renderTasks();
  if (window.lucide) lucide.createIcons();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function renderAll() {
  renderOverview();
  renderTasks();
  renderCalendar();
  if (window.lucide) lucide.createIcons();
}

function initializeSelects() {
  const filter = document.getElementById("channelFilter");
  const newTask = document.getElementById("newTaskChannel");
  channels.forEach(channel => {
    filter.insertAdjacentHTML("beforeend", `<option value="${channel}">${channel}</option>`);
    newTask.insertAdjacentHTML("beforeend", `<option value="${channel}">${channel}</option>`);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSelects();
  renderAll();
  loadMetrics();
  if (window.lucide) lucide.createIcons();

  document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
  document.querySelectorAll("[data-go]").forEach(button => button.addEventListener("click", () => showView(button.dataset.go)));
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-toggle]");
    if (button) toggleTask(Number(button.dataset.toggle));
  });
  document.addEventListener("change", event => {
    if (event.target.matches("[data-status-id]")) setStatus(Number(event.target.dataset.statusId), event.target.value);
  });

  ["taskSearch", "channelFilter", "monthFilter", "statusFilter"].forEach(id => document.getElementById(id).addEventListener(id === "taskSearch" ? "input" : "change", renderTasks));
  document.getElementById("resetFilters").addEventListener("click", () => { document.getElementById("taskSearch").value = ""; document.getElementById("channelFilter").value = "all"; document.getElementById("monthFilter").value = "all"; document.getElementById("statusFilter").value = "all"; renderTasks(); });
  document.getElementById("previousMonth").addEventListener("click", () => { currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() - 1); renderCalendar(); if (window.lucide) lucide.createIcons(); });
  document.getElementById("nextMonth").addEventListener("click", () => { currentCalendarMonth.setMonth(currentCalendarMonth.getMonth() + 1); renderCalendar(); if (window.lucide) lucide.createIcons(); });
  document.getElementById("saveMetrics").addEventListener("click", saveMetrics);

  const cloudDialog = document.getElementById("cloudDialog");
  document.getElementById("cloudStatusButton").addEventListener("click", () => cloudDialog.showModal());
  document.getElementById("closeCloudDialog").addEventListener("click", () => cloudDialog.close());
  document.getElementById("disconnectCloud").addEventListener("click", async () => { await disconnectCloud(); cloudDialog.close(); showToast("Sessao encerrada."); });
  document.getElementById("cloudForm").addEventListener("submit", async event => {
    event.preventDefault();
    const feedback = document.getElementById("cloudFeedback");
    const button = document.getElementById("connectCloudButton");
    feedback.textContent = "";
    button.disabled = true;
    try {
      await connectCloud(document.getElementById("cloudEmail").value, document.getElementById("cloudPassword").value);
      cloudDialog.close();
      showToast("Painel conectado ao Supabase.");
    } catch (error) {
      cloudConnected = false;
      setCloudStatus("error", "Nao conectado");
      feedback.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });

  restoreSession().catch(error => {
    setCloudStatus("error", "Falha na sessao");
    showToast(error.message);
  });

  const migrationDialog = document.getElementById("migrationDialog");
  ["closeMigrationDialog", "cancelMigration"].forEach(id => document.getElementById(id).addEventListener("click", () => migrationDialog.close()));
  document.getElementById("confirmMigration").addEventListener("click", async () => {
    const button = document.getElementById("confirmMigration");
    const feedback = document.getElementById("migrationFeedback");
    button.disabled = true;
    feedback.textContent = "Importando...";
    try {
      const result = await importMigrationPreview();
      feedback.textContent = `${result.actions} acoes importadas; ${result.contentsInserted} conteudos novos; ${result.contentsMatched} existentes preservados.`;
      showToast("Migracao concluida no Supabase.");
    } catch (error) {
      feedback.textContent = error.message;
      button.disabled = false;
    }
  });

  const dialog = document.getElementById("taskDialog");
  document.getElementById("addTaskButton").addEventListener("click", () => { document.getElementById("newTaskDate").value = "2026-11-06"; dialog.showModal(); });
  ["closeDialog", "cancelDialog"].forEach(id => document.getElementById(id).addEventListener("click", () => dialog.close()));
  document.getElementById("taskForm").addEventListener("submit", async event => {
    event.preventDefault();
    const task = { id: Date.now(), title: document.getElementById("newTaskTitle").value.trim(), channel: document.getElementById("newTaskChannel").value, date: document.getElementById("newTaskDate").value, status: "pending", note: document.getElementById("newTaskNote").value.trim(), type: "content" };
    tasks.push(task);
    if (cloudConnected && authorityContext) {
      const week = weekForDate(task.date, authorityContext.weeks);
      const { data, error } = await getSupabaseClient().from("plan_actions").insert({
        workspace_id: authorityContext.workspace.id,
        plan_id: authorityContext.plan.id,
        week_id: week.id,
        title: task.title,
        channel: task.channel,
        due_date: task.date,
        status: task.status,
        notes: task.note,
        source_local_id: String(task.id)
      }).select("id").single();
      if (error) showToast(error.message); else task.dbId = data.id;
    }
    event.target.reset(); dialog.close(); saveTasks(); showToast("Tarefa adicionada.");
  });

  document.getElementById("advanceZenodo").addEventListener("click", () => {
    const task = tasks.find(t => t.id === 1); task.status = "done"; saveTasks(); showToast("Cadastro do Zenodo marcado como concluido.");
  });

  document.getElementById("exportButton").addEventListener("click", () => {
    const data = {
      exportedAt: new Date().toISOString(),
      source: cloudConnected ? "supabase" : "localStorage",
      plan: authorityContext?.plan || null,
      weeks: authorityContext?.weeks || [],
      contents: authorityContext?.contents || [],
      tasks,
      metrics: JSON.parse(localStorage.getItem(METRICS_KEY) || "{}")
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "agmiz-painel-backup.json"; link.click(); URL.revokeObjectURL(link.href);
    showToast("Backup exportado.");
  });
});
