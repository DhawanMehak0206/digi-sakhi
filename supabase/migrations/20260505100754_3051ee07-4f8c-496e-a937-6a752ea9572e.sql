
create or replace function public.claim_admin()
returns boolean language plpgsql security definer set search_path = public as $$
declare admin_exists boolean;
begin
  if auth.uid() is null then return false; end if;
  select exists(select 1 from public.user_roles where role='admin') into admin_exists;
  if admin_exists then return false; end if;
  insert into public.user_roles(user_id, role) values (auth.uid(),'admin');
  return true;
end; $$;
revoke execute on function public.claim_admin() from public, anon;
grant execute on function public.claim_admin() to authenticated;

create or replace function public.is_current_user_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role='admin')
$$;
revoke execute on function public.is_current_user_admin() from public, anon;
grant execute on function public.is_current_user_admin() to authenticated;
