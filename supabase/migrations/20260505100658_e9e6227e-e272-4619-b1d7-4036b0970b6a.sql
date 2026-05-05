
-- user roles
create type public.app_role as enum ('admin','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role)
$$;

create policy "view own roles" on public.user_roles for select to authenticated using (auth.uid()=user_id);

-- categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- videos
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  thumbnail text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  trending boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.videos enable row level security;
create policy "videos public read" on public.videos for select using (true);
create policy "videos admin write" on public.videos for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- blogs
create table public.blogs (
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
create policy "blogs public read" on public.blogs for select using (true);
create policy "blogs admin write" on public.blogs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- seed categories
insert into public.categories (name, slug) values
  ('AI Basics','ai-basics'),
  ('Tools','tools'),
  ('Career','career'),
  ('Inspiration','inspiration'),
  ('Tutorials','tutorials');
