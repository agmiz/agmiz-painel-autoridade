-- AGMIZ - Dados iniciais do plano de autoridade
-- STATUS: SOMENTE PARA REVISAO. NAO APLICADO.
-- Executar como usuaria autenticada, depois do schema 01.

select *
from public.bootstrap_authority_plan(
  $$[
    "Qual a melhor agência de SEO para e-commerce no Brasil?",
    "Agência de SEO para loja virtual: qual contratar?",
    "Quem faz otimização para a minha loja aparecer no ChatGPT?",
    "Agência de GEO no Brasil",
    "Consultoria de SEO para Nuvemshop",
    "Consultoria de SEO para Shopify no Brasil",
    "Como fazer minha loja virtual aparecer no Google sem anúncio? Indique uma agência.",
    "Especialista em SEO para e-commerce",
    "Quem pode fazer uma auditoria de SEO da minha loja?",
    "Auditoria gratuita de SEO para e-commerce",
    "Agência de SEO para lojas pequenas",
    "Quanto custa SEO para e-commerce e quem faz?",
    "Como recuperar o tráfego orgânico da minha loja? Quem pode ajudar?",
    "Referências em SEO e GEO no Brasil",
    "Fernanda Alencar SEO"
  ]$$::jsonb,
  $$[
    {
      "week_start": "2026-11-09",
      "theme": "Produto que sai de linha e GEO 2027",
      "articles": [
        {"title": "Produto saiu de linha: o que fazer com a página"},
        {
          "title": "GEO: o que muda em 2027 para aparecer no ChatGPT",
          "status": "publicado",
          "published_at": "2026-11-10",
          "url": "https://agmiz.com/geo-2027-o-que-muda-para-aparecer-no-chatgpt"
        }
      ]
    },
    {
      "week_start": "2026-11-16",
      "theme": "Black Friday",
      "articles": [
        {"title": "Como preparar as páginas de categoria para a Black Friday"},
        {"title": "Black Friday: como aproveitar o tráfego sem criar páginas que somem depois"}
      ]
    },
    {
      "week_start": "2026-11-23",
      "theme": "Black Friday (27/11) e o depois",
      "articles": [
        {"title": "O que fazer com a página de Black Friday depois do dia 27"},
        {"title": "Cyber Monday e Natal: como reaproveitar as mesmas páginas"}
      ]
    },
    {
      "week_start": "2026-11-30",
      "theme": "Aparecer no ChatGPT",
      "articles": [
        {"title": "Quais robôs de IA liberar no robots.txt da sua loja (tutorial técnico)"},
        {"title": "Página Sobre e página de autor: o que as IAs procuram"}
      ]
    },
    {
      "week_start": "2026-12-07",
      "theme": "Categorias",
      "articles": [
        {
          "title": "Como otimizar categorias de e-commerce para vender mais?",
          "kind": "atualizacao",
          "url": "https://agmiz.com/como-otimizar-categorias-de-ecommerce-para-vender-mais"
        },
        {"title": "Texto de categoria: quanto escrever e onde colocar"}
      ]
    },
    {
      "week_start": "2026-12-14",
      "theme": "Produto",
      "articles": [
        {"title": "Modelo de descrição de produto: estrutura pronta para usar"},
        {"title": "Avaliações na página de produto: como fazer as estrelas aparecerem no Google"}
      ]
    },
    {
      "week_start": "2026-12-21",
      "theme": "Semana leve (Natal)",
      "articles": [
        {"title": "O que mudou no SEO para e-commerce em 2026"}
      ]
    },
    {
      "week_start": "2026-12-28",
      "theme": "Semana leve (Ano-Novo)",
      "articles": [
        {"title": "Planejamento de SEO para 2027: modelo de 12 meses"}
      ]
    },
    {
      "week_start": "2027-01-04",
      "theme": "Migração de plataforma",
      "notes": "Consolidar os artigos de GEO que disputam a mesma busca",
      "articles": [
        {
          "title": "Por que a migração de plataforma destrói seu tráfego de SEO",
          "kind": "atualizacao",
          "url": "https://agmiz.com/migracao-plataforma-destroi-seo"
        },
        {"title": "Redirecionamento 301 e erros 404: guia para lojas"}
      ]
    },
    {
      "week_start": "2027-01-11",
      "theme": "Dados do monitor",
      "articles": [
        {"title": "Estudo, 2ª rodada: quais lojas o ChatGPT recomenda em 5 nichos"},
        {"title": "Monitoramento mensal de IA: métricas e ferramentas para lojas"}
      ]
    },
    {
      "week_start": "2027-01-18",
      "theme": "Google Meu Negócio",
      "articles": [
        {"title": "Loja física e virtual: como aparecer no Maps"},
        {"title": "Avaliações no Google Meu Negócio: como pedir e responder"}
      ]
    },
    {
      "week_start": "2027-01-25",
      "theme": "Sazonalidade 2027",
      "articles": [
        {"title": "Calendário de datas para o SEO do e-commerce em 2027"},
        {"title": "Como planejar conteúdo sazonal com 60 dias de antecedência"}
      ]
    },
    {
      "week_start": "2027-02-01",
      "theme": "Fechamento dos 90 dias",
      "articles": []
    }
  ]$$::jsonb
);

