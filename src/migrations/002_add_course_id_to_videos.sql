-- Adds course linking to existing videos tables without resetting data.

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'videos'
      and column_name = 'course_id'
  ) then
    alter table public.videos add column course_id uuid;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'videos_course_id_fkey'
      and conrelid = 'public.videos'::regclass
  ) then
    alter table public.videos
      add constraint videos_course_id_fkey
      foreign key (course_id) references public.courses(id) on delete set null;
  end if;
end $$;
