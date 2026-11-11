-- AGMIZ - Plano de autoridade de 90 dias
-- STATUS: SOMENTE PARA REVISAO. NAO APLICADO.
-- Projeto Supabase alvo: exmzvxggmuyqeihusepq (Agmiz Controle + CRM)
--
-- Este arquivo NAO altera nem apaga as tabelas existentes do painel semanal.
-- Em especial, nao executa DDL sobre:
-- businesses, clients, tasks, weekly_priorities, planner_settings,
-- recurring_activities e financial_challenge_entries.

begin;

create extension if not exists pgcrypto;

-- Funcoes comuns ------------------------------------------------------------

create or replace function public.authority_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Workspace raiz. workspace_id e um alias gerado de id para manter o contrato
-- comum solicitado sem criar uma autorreferencia redundante.
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid generated always as (id) stored unique,
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name)
);

-- Metodo reutilizavel --------------------------------------------------------

create table if not exists public.plan_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  description text not null default '',
  phases jsonb not null default '[]'::jsonb check (jsonb_typeof(phases) = 'array'),
  decision_rules jsonb not null default '[]'::jsonb check (jsonb_typeof(decision_rules) = 'array'),
  standard_questions jsonb not null default '[]'::jsonb check (jsonb_typeof(standard_questions) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, name)
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  template_id uuid references public.plan_templates(id) on delete set null,
  name text not null,
  start_date date not null,
  end_date date not null,
  objective text not null default '',
  status text not null default 'ativo' check (status in ('rascunho', 'ativo', 'pausado', 'concluido', 'arquivado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date),
  unique (workspace_id, name)
);

create table if not exists public.plan_weeks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  week_start date not null,
  theme text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, week_start)
);

-- Conteudos e checklist operacional -----------------------------------------

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  week_id uuid references public.plan_weeks(id) on delete set null,
  content_type text not null check (content_type in (
    'artigo', 'linkedin', 'linkedin_artigo', 'carrossel', 'video',
    'web_story', 'slideshare', 'zenodo', 'gmn'
  )),
  title text not null,
  primary_query text not null default '',
  url text,
  status text not null default 'ideia' check (status in ('ideia', 'briefing', 'rascunho', 'revisao', 'publicado')),
  kind text not null default 'novo' check (kind in ('novo', 'atualizacao')),
  published_at date,
  parent_id uuid references public.content_items(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_checks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  check_type text not null check (check_type in ('indexacao_14_dias', 'impressoes_45_dias', 'revisao')),
  due_date date not null,
  result text not null default '',
  action_taken text not null default '',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_item_id, check_type)
);

-- Tabela adicional necessaria para preservar as 103 tarefas do checklist.
create table if not exists public.plan_actions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  week_id uuid references public.plan_weeks(id) on delete set null,
  content_item_id uuid references public.content_items(id) on delete set null,
  title text not null,
  channel text not null default '',
  due_date date,
  status text not null default 'pending' check (status in ('pending', 'progress', 'done')),
  notes text not null default '',
  source_local_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, source_local_id)
);

-- Medicao -------------------------------------------------------------------

create table if not exists public.metric_snapshots (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  snapshot_date date not null,
  source text not null check (source in ('gsc', 'ga4', 'comercial')),
  metric text not null,
  value numeric not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists metric_snapshots_one_per_week_idx
  on public.metric_snapshots (
    plan_id,
    source,
    metric,
    date_trunc('week', snapshot_date::timestamp)
  );

-- Monitor de IA -------------------------------------------------------------

create table if not exists public.ai_prompts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  question_text text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_id, question_text)
);

-- A inspecao de 11/11/2026 confirmou que ai_checks ainda nao existe no projeto.
create table if not exists public.ai_checks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  prompt_id uuid references public.ai_prompts(id) on delete set null,
  checked_at timestamptz not null default now(),
  source text not null check (source in ('plano', 'auditoria', 'acompanhamento')),
  brand_domain text not null,
  model text not null,
  brand_appears boolean not null default false,
  position integer check (position is null or position > 0),
  competitors_cited jsonb not null default '[]'::jsonb check (jsonb_typeof(competitors_cited) = 'array'),
  sources_cited jsonb not null default '[]'::jsonb check (jsonb_typeof(sources_cited) = 'array'),
  raw_response text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Historico de decisoes -----------------------------------------------------

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid not null references public.plans(id) on delete cascade,
  decision_date date not null default current_date,
  situation text not null,
  decision text not null,
  result text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Checks automaticos de 14 e 45 dias ---------------------------------------

create or replace function public.authority_create_publication_checks()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.content_type = 'artigo'
     and new.status = 'publicado'
     and new.published_at is not null then

    insert into public.content_checks (
      workspace_id, content_item_id, check_type, due_date
    ) values
      (new.workspace_id, new.id, 'indexacao_14_dias', new.published_at + 14),
      (new.workspace_id, new.id, 'impressoes_45_dias', new.published_at + 45)
    on conflict (content_item_id, check_type)
    do update set
      workspace_id = excluded.workspace_id,
      due_date = excluded.due_date,
      updated_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists authority_content_publication_checks on public.content_items;
create trigger authority_content_publication_checks
after insert or update of status, published_at
on public.content_items
for each row execute function public.authority_create_publication_checks();

-- updated_at ----------------------------------------------------------------

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'workspaces', 'plan_templates', 'plans', 'plan_weeks', 'content_items',
    'content_checks', 'plan_actions', 'metric_snapshots', 'ai_prompts',
    'ai_checks', 'decisions'
  ] loop
    execute format('drop trigger if exists authority_updated_at on public.%I', table_name);
    execute format(
      'create trigger authority_updated_at before update on public.%I for each row execute function public.authority_set_updated_at()',
      table_name
    );
  end loop;
end;
$$;

-- Indices -------------------------------------------------------------------

create index if not exists plan_templates_workspace_idx on public.plan_templates(workspace_id);
create index if not exists plans_workspace_idx on public.plans(workspace_id);
create index if not exists plans_dates_idx on public.plans(start_date, end_date);
create index if not exists plan_weeks_plan_date_idx on public.plan_weeks(plan_id, week_start);
create index if not exists content_items_plan_idx on public.content_items(plan_id);
create index if not exists content_items_week_idx on public.content_items(week_id);
create index if not exists content_items_status_idx on public.content_items(status);
create index if not exists content_items_parent_idx on public.content_items(parent_id);
create unique index if not exists content_items_plan_week_type_title_idx
  on public.content_items(plan_id, week_id, content_type, title);
create index if not exists content_checks_due_idx on public.content_checks(due_date, completed_at);
create index if not exists plan_actions_due_idx on public.plan_actions(plan_id, due_date, status);
create index if not exists metric_snapshots_plan_date_idx on public.metric_snapshots(plan_id, snapshot_date);
create index if not exists ai_prompts_plan_idx on public.ai_prompts(plan_id, active);
create index if not exists ai_checks_plan_date_idx on public.ai_checks(plan_id, checked_at);
create index if not exists decisions_plan_date_idx on public.decisions(plan_id, decision_date);

-- RLS -----------------------------------------------------------------------

alter table public.workspaces enable row level security;
alter table public.plan_templates enable row level security;
alter table public.plans enable row level security;
alter table public.plan_weeks enable row level security;
alter table public.content_items enable row level security;
alter table public.content_checks enable row level security;
alter table public.plan_actions enable row level security;
alter table public.metric_snapshots enable row level security;
alter table public.ai_prompts enable row level security;
alter table public.ai_checks enable row level security;
alter table public.decisions enable row level security;

drop policy if exists "authority own workspaces" on public.workspaces;
create policy "authority own workspaces"
on public.workspaces for all to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

do $$
declare
  table_name text;
  policy_name text;
begin
  foreach table_name in array array[
    'plan_templates', 'plans', 'plan_weeks', 'content_items', 'content_checks',
    'plan_actions', 'metric_snapshots', 'ai_prompts', 'ai_checks', 'decisions'
  ] loop
    policy_name := 'authority own ' || table_name;
    execute format('drop policy if exists %I on public.%I', policy_name, table_name);
    execute format(
      'create policy %I on public.%I for all to authenticated using (exists (select 1 from public.workspaces w where w.id = public.%I.workspace_id and w.owner_id = auth.uid())) with check (exists (select 1 from public.workspaces w where w.id = public.%I.workspace_id and w.owner_id = auth.uid()))',
      policy_name,
      table_name,
      table_name,
      table_name
    );
  end loop;
end;
$$;

drop function if exists public.authority_owns_workspace(uuid);

-- Bootstrap autenticado -----------------------------------------------------
-- A funcao cria workspace, template, plano, semanas e artigos para o usuario.
-- Os temas e artigos sao recebidos em p_weeks; nao ficam fixos no schema.

create or replace function public.bootstrap_authority_plan(
  p_standard_questions jsonb,
  p_weeks jsonb
)
returns table (workspace_id uuid, template_id uuid, plan_id uuid)
language plpgsql
security invoker
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_workspace_id uuid;
  v_template_id uuid;
  v_plan_id uuid;
  v_week_id uuid;
  v_week jsonb;
  v_article jsonb;
  v_rules jsonb := jsonb_build_array(
    jsonb_build_object('condition', 'Nao indexado em 14 dias', 'action', 'Revisar acesso, canonical, sitemap e qualidade.'),
    jsonb_build_object('condition', 'Indexado sem impressoes em 45 dias', 'action', 'Revisar intencao, titulo e links internos.'),
    jsonb_build_object('condition', 'Impressoes sem cliques', 'action', 'Melhorar titulo, promessa e descricao.'),
    jsonb_build_object('condition', 'Cliques sem auditorias', 'action', 'Revisar CTA, oferta e continuidade da pagina.'),
    jsonb_build_object('condition', 'Bom desempenho em um canal', 'action', 'Transformar o tema nos outros formatos.'),
    jsonb_build_object('condition', 'Duas pecas competindo pela mesma busca', 'action', 'Consolidar antes de publicar outra.'),
    jsonb_build_object('condition', 'Auditorias sem conversa', 'action', 'Revisar o relatorio e a mensagem de WhatsApp.'),
    jsonb_build_object('condition', 'Pergunta de IA em que um concorrente sempre aparece', 'action', 'Estudar a pagina citada e criar uma resposta melhor no blog.')
  );
  v_phases jsonb := jsonb_build_array(
    jsonb_build_object('name', 'Fundacao e primeiro sprint', 'weeks', jsonb_build_array(1, 2)),
    jsonb_build_object('name', 'Distribuicao e pesquisa', 'weeks', jsonb_build_array(3, 6)),
    jsonb_build_object('name', 'Autoridade e publicacao dos estudos', 'weeks', jsonb_build_array(7, 11)),
    jsonb_build_object('name', 'Medicao e proximo ciclo', 'weeks', jsonb_build_array(12, 13))
  );
begin
  if auth.uid() is null then
    raise exception 'Usuario autenticado obrigatorio';
  end if;

  if jsonb_typeof(p_standard_questions) <> 'array'
     or jsonb_array_length(p_standard_questions) < 1 then
    raise exception 'Informe pelo menos uma pergunta padrao';
  end if;

  if jsonb_typeof(p_weeks) <> 'array'
     or jsonb_array_length(p_weeks) < 1 then
    raise exception 'Informe pelo menos uma semana em p_weeks';
  end if;

  insert into public.workspaces (name, owner_id)
  values ('Ágmiz', auth.uid())
  on conflict (owner_id, name)
  do update set updated_at = now()
  returning id into v_workspace_id;

  insert into public.plan_templates (
    workspace_id, name, description, phases, decision_rules, standard_questions
  ) values (
    v_workspace_id,
    'Plano de autoridade 90 dias',
    'Metodo reutilizavel para planejar, publicar, distribuir e medir a autoridade da Ágmiz no Google e nas inteligencias artificiais.',
    v_phases,
    v_rules,
    p_standard_questions
  )
  on conflict (workspace_id, name)
  do update set
    description = excluded.description,
    phases = excluded.phases,
    decision_rules = excluded.decision_rules,
    standard_questions = excluded.standard_questions,
    updated_at = now()
  returning id into v_template_id;

  insert into public.plans (
    workspace_id, template_id, name, start_date, end_date, objective, status
  ) values (
    v_workspace_id,
    v_template_id,
    'Ágmiz 10/11/2026 a 02/02/2027',
    date '2026-11-10',
    date '2027-02-02',
    'Fazer a Ágmiz e Fernanda Alencar serem encontradas no Google, citadas pelas IAs e escolhidas por empresas e e-commerces.',
    'ativo'
  )
  on conflict (workspace_id, name)
  do update set
    template_id = excluded.template_id,
    start_date = excluded.start_date,
    end_date = excluded.end_date,
    objective = excluded.objective,
    updated_at = now()
  returning id into v_plan_id;

  insert into public.ai_prompts (
    workspace_id, plan_id, question_text, active
  )
  select
    v_workspace_id,
    v_plan_id,
    question_text,
    true
  from (
    select nullif(btrim(value #>> '{}'), '') as question_text
    from jsonb_array_elements(p_standard_questions)
  ) questions
  where question_text is not null
  on conflict (plan_id, question_text) do nothing;

  for v_week in select value from jsonb_array_elements(p_weeks)
  loop
    if nullif(v_week->>'week_start', '') is null then
      raise exception 'Cada semana precisa de week_start';
    end if;

    if jsonb_typeof(coalesce(v_week->'articles', '[]'::jsonb)) <> 'array' then
      raise exception 'articles precisa ser uma lista na semana %', v_week->>'week_start';
    end if;

    v_week_id := null;

    insert into public.plan_weeks (
      workspace_id, plan_id, week_start, theme, notes
    ) values (
      v_workspace_id,
      v_plan_id,
      (v_week->>'week_start')::date,
      coalesce(v_week->>'theme', ''),
      coalesce(v_week->>'notes', '')
    )
    on conflict (plan_id, week_start) do nothing
    returning id into v_week_id;

    if v_week_id is null then
      select id
      into v_week_id
      from public.plan_weeks
      where plan_id = v_plan_id
        and week_start = (v_week->>'week_start')::date;

      update public.plan_weeks pw
      set
        theme = case
          when nullif(v_week->>'theme', '') is not null
            then v_week->>'theme'
          else pw.theme
        end,
        notes = case
          when nullif(v_week->>'notes', '') is not null
            then v_week->>'notes'
          else pw.notes
        end
      where pw.id = v_week_id
        and (
          nullif(v_week->>'theme', '') is not null
          or nullif(v_week->>'notes', '') is not null
        )
        and not exists (
          select 1
          from public.content_items ci
          where ci.week_id = pw.id
            and ci.status = 'publicado'
        );
    end if;

    for v_article in
      select value
      from jsonb_array_elements(coalesce(v_week->'articles', '[]'::jsonb))
    loop
      if nullif(v_article->>'title', '') is null then
        raise exception 'Cada artigo precisa de title na semana %', v_week->>'week_start';
      end if;

      insert into public.content_items (
        workspace_id, plan_id, week_id, content_type, title, primary_query,
        url, status, kind, published_at
      ) values (
        v_workspace_id,
        v_plan_id,
        v_week_id,
        'artigo',
        v_article->>'title',
        coalesce(v_article->>'primary_query', ''),
        nullif(v_article->>'url', ''),
        coalesce(nullif(v_article->>'status', ''), 'ideia'),
        coalesce(nullif(v_article->>'kind', ''), 'novo'),
        nullif(v_article->>'published_at', '')::date
      )
      on conflict (plan_id, week_id, content_type, title) do nothing;
    end loop;
  end loop;

  return query select v_workspace_id, v_template_id, v_plan_id;
end;
$$;

revoke all on function public.bootstrap_authority_plan(jsonb, jsonb) from public;
grant execute on function public.bootstrap_authority_plan(jsonb, jsonb) to authenticated;

commit;

-- NAO EXECUTAR AINDA.
-- Depois da aprovacao, executar o arquivo 02-bootstrap-plano-REVISAO.sql
-- em uma sessao autenticada como a dona do workspace.
