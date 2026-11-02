-- Site visitor ticker + page view tracking
create table if not exists public.site_stats (
  key text primary key,
  value bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_path_idx on public.page_views (path);
create index if not exists page_views_created_at_idx on public.page_views (created_at desc);

alter table public.site_stats enable row level security;
alter table public.page_views enable row level security;

drop policy if exists "public read site_stats" on public.site_stats;
drop policy if exists "public write site_stats" on public.site_stats;
create policy "public read site_stats" on public.site_stats for select using (true);
create policy "public write site_stats" on public.site_stats for all using (true) with check (true);

drop policy if exists "public read page_views" on public.page_views;
drop policy if exists "public write page_views" on public.page_views;
create policy "public read page_views" on public.page_views for select using (true);
create policy "public write page_views" on public.page_views for all using (true) with check (true);

grant select, insert, update, delete on public.site_stats to anon, authenticated;
grant select, insert, update, delete on public.page_views to anon, authenticated;

insert into public.site_stats (key, value)
values ('visitor_count', 15000)
on conflict (key) do nothing;

create or replace function public.increment_visitor_count()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_value bigint;
begin
  insert into public.site_stats (key, value)
  values ('visitor_count', 5001)
  on conflict (key) do update
    set value = public.site_stats.value + 1,
        updated_at = now()
  returning value into new_value;

  return new_value;
end;
$$;

grant execute on function public.increment_visitor_count() to anon, authenticated;
