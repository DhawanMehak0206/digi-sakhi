-- Tech Bloom / Hertech: permissive public schema
-- WARNING: This migration enables FULL public read/write (anon) access.
-- Apply in Supabase SQL editor or via CLI.

create extension if not exists pgcrypto;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;

-- Question sets (stores questions/options as JSON)
create table if not exists public.question_sets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.question_sets enable row level security;

-- Quizzes (many question sets)
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.quizzes enable row level security;

create table if not exists public.quiz_question_sets (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_set_id uuid not null references public.question_sets(id) on delete cascade,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique(quiz_id, question_set_id)
);
alter table public.quiz_question_sets enable row level security;

-- Videos
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  thumbnail text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  tags text[] not null default '{}',
  quiz_id uuid references public.quizzes(id) on delete set null,
  featured boolean not null default false,
  trending boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.videos enable row level security;

-- Blogs
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  cover_image text,
  tags text[] not null default '{}',
  category_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.blogs enable row level security;

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);
alter table public.courses enable row level security;

create table if not exists public.course_items (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  video_id uuid not null references public.videos(id) on delete cascade,
  position int not null default 0,
  locked boolean not null default false,
  created_at timestamptz not null default now(),
  unique(course_id, video_id)
);
alter table public.course_items enable row level security;

-- Grants (anon + authenticated)
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
alter default privileges in schema public grant select, insert, update, delete on tables to anon, authenticated;
alter default privileges in schema public grant usage, select on sequences to anon, authenticated;

-- RLS policies: allow everything for anon/authenticated
do $$
declare
  t text;
begin
  foreach t in array array[
    'categories','question_sets','quizzes','quiz_question_sets','videos','blogs','courses','course_items'
  ] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('drop policy if exists "public write" on public.%I', t);
    execute format('create policy "public read" on public.%I for select using (true)', t);
    execute format('create policy "public write" on public.%I for all using (true) with check (true)', t);
  end loop;
end $$;

