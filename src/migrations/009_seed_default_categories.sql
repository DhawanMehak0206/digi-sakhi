-- Seeds the standard category set for blogs and site navigation.

insert into public.categories (name, slug)
values
  ('AI Basics', 'ai-basics'),
  ('Tools', 'tools'),
  ('Career', 'career'),
  ('Productivity', 'productivity'),
  ('Coding', 'coding')
on conflict (slug) do nothing;
