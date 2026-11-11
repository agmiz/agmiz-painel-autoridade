-- STATUS: PROPOSTA PARA REVISAO. NAO APLICADO.
-- Objetivo: manter INSERT anonimo e limitar SELECT a dona autenticada.
-- Nao existem policies de UPDATE ou DELETE para anon nesta tabela.

begin;

drop policy if exists "authenticated read mentoria buzios leads"
  on public.mentoria_buzios_leads;

create policy "owner read mentoria buzios leads"
on public.mentoria_buzios_leads
for select
to authenticated
using (auth.uid() = 'a7334d53-db49-4acf-94fd-22976f536618'::uuid);

-- Mantida sem alteracao:
-- create policy "public insert mentoria buzios leads"
-- on public.mentoria_buzios_leads
-- for insert to anon
-- with check (true);

commit;

