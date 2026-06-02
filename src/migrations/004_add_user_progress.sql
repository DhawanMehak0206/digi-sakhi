-- Stores per-user learning progress for authenticated users.

create table if not exists public.user_video_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique(user_id, video_id)
);
alter table public.user_video_progress enable row level security;

create table if not exists public.user_quiz_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  passed_at timestamptz not null default now(),
  unique(user_id, quiz_id)
);
alter table public.user_quiz_progress enable row level security;

grant select, insert, update, delete on public.user_video_progress to authenticated;
grant select, insert, update, delete on public.user_quiz_progress to authenticated;

do $$
declare
  t text;
begin
  foreach t in array array['user_video_progress','user_quiz_progress'] loop
    execute format('drop policy if exists "own read" on public.%I', t);
    execute format('drop policy if exists "own write" on public.%I', t);
    execute format('create policy "own read" on public.%I for select using (auth.uid() = user_id)', t);
    execute format('create policy "own write" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;
