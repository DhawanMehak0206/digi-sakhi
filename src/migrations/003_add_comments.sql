-- Adds threaded comments for videos to existing databases.

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos(id) on delete cascade,
  parent_id uuid,
  author_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'comments_parent_id_fkey'
      and conrelid = 'public.comments'::regclass
  ) then
    alter table public.comments
      add constraint comments_parent_id_fkey
      foreign key (parent_id) references public.comments(id) on delete cascade;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'comments_video_id_fkey'
      and conrelid = 'public.comments'::regclass
  ) then
    alter table public.comments
      add constraint comments_video_id_fkey
      foreign key (video_id) references public.videos(id) on delete cascade;
  end if;
end $$;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.comments to anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'comments' and policyname = 'public read'
  ) then
    create policy "public read" on public.comments for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'comments' and policyname = 'public write'
  ) then
    create policy "public write" on public.comments for all using (true) with check (true);
  end if;
end $$;
