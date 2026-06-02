-- Adds the `user` enum value in its own migration so it can be committed first.

do $$
begin
  if not exists (
    select 1
    from pg_enum e
    join pg_type t on t.oid = e.enumtypid
    where t.typname = 'app_role' and e.enumlabel = 'user'
  ) then
    alter type public.app_role add value 'user';
  end if;
end $$;
