# Inventario e plano de migracao

Data da inspecao: 11/11/2026  
Projeto Supabase: `exmzvxggmuyqeihusepq` (`Agmiz Controle + CRM`)  
Status: nenhuma alteracao aplicada.

## Tabelas existentes em `public`

1. `businesses`
2. `clients`
3. `crm_activities`
4. `crm_contacts`
5. `crm_diagnostic_access`
6. `crm_diagnostic_checklist`
7. `crm_diagnostic_history`
8. `crm_diagnostic_share_links`
9. `crm_prospecting_daily`
10. `crm_settings`
11. `crm_tasks`
12. `financial_challenge_entries`
13. `mentoria_buzios_leads`
14. `planner_settings`
15. `prospect_whatsapp_leads`
16. `prospect_whatsapp_templates`
17. `recurring_activities`
18. `tasks`
19. `weekly_priorities`

`ai_checks` nao existe no projeto na data desta inspecao. O SQL de revisao cria
essa tabela nova; nao tenta alterar uma tabela preexistente.

## Tabelas protegidas

O SQL nao altera nem apaga:

- `clients`
- `tasks`
- `weekly_priorities`
- `planner_settings`
- `businesses`
- `recurring_activities`
- `financial_challenge_entries`

## Complemento necessario ao modelo solicitado

O painel atual possui 103 tarefas. Nem todas representam conteudos publicaveis:
ha configuracoes, entrevistas, cadastros e rotinas operacionais. Por isso o SQL
propoe tambem `plan_actions`, com RLS por workspace, para migrar o checklist sem
forcar tarefas operacionais para dentro de `content_items`.

Mapeamento previsto:

- publicacoes e seus formatos: `content_items`;
- verificacoes de 14 e 45 dias: `content_checks`;
- tarefas operacionais: `plan_actions`;
- medidas semanais: `metric_snapshots`;
- perguntas e verificacoes de IA: `ai_prompts` e `ai_checks`;
- mudancas de estrategia: `decisions`.

## Ordem segura de execucao

1. Revisar e aprovar `01-plano-autoridade-schema-REVISAO.sql`.
2. Receber e inserir as 15 perguntas fixas no bootstrap.
3. Aplicar o schema e criar workspace, template, plano e semanas.
4. Conectar o painel de 90 dias ao Supabase com a publishable key.
5. Importar o estado existente do `localStorage` pela propria sessao do navegador.
6. Exibir contagens e amostras migradas para conferencia.
7. Somente depois da conferencia, remover o uso do `localStorage`.
8. Adicionar o card de leitura ao painel semanal.
9. Executar os avisos de seguranca do Supabase e corrigir eventuais achados.
10. Publicar os dois paineis.

## Pendencias antes da aplicacao

- revisao final dos cinco ajustes do SQL de estrutura;
- decisao editorial sobre os titulos que disputam buscas de artigos existentes.

## Pendencia antes de virar produto

- Adicionar FKs compostas `(plan_id, workspace_id)` nas tabelas filhas para
  impedir que uma linha aponte para um plano pertencente a outro workspace.
  O RLS ja restringe o acesso ao dono, mas essa integridade deve ser reforcada
  no banco antes de transformar o painel em produto multiworkspace.

