-- Spustit jednou v Supabase > SQL Editor pro databázi Uki.
-- Práva ke vkládání a mazání dostane jen stávající účet organizátorky.
-- Ostatní uživatelé tím žádná nová práva nezískají.
alter table public.uki_cepice enable row level security;

drop policy if exists "uki_cepice_admin_insert" on public.uki_cepice;
create policy "uki_cepice_admin_insert"
on public.uki_cepice for insert to authenticated
with check (auth.uid() = '868c3d5b-19f5-4bd5-a199-1b1eb76609eb'::uuid);

drop policy if exists "uki_cepice_admin_delete" on public.uki_cepice;
create policy "uki_cepice_admin_delete"
on public.uki_cepice for delete to authenticated
using (auth.uid() = '868c3d5b-19f5-4bd5-a199-1b1eb76609eb'::uuid);
