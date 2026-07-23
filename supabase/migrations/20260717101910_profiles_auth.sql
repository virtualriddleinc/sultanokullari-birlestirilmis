-- Sultan Okulları — Supabase auth profili (hearing-crm profiles uyarlaması)
-- Kayıt olan kullanıcı için otomatik profil; e-posta onayı Supabase Auth ile,
-- uygulama içi "yönetici onayı" ise profiles.approved ile yönetilir.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  approved boolean not null default false,
  is_active boolean not null default true,
  rejected boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Tablo düzeyi yetki: RLS yalnızca GRANT verildikten sonra uygulanır.
-- Kullanıcı yalnızca RLS policy'siyle kendi satırını okuyabilir; yazma/yönetim
-- işlemleri trigger (security definer) ve service_role ile yapılır.
grant select on public.profiles to authenticated;
-- service_role (yönetici onay işlemleri) RLS baypas eder; DML yetkisi verilir.
grant select, insert, update, delete on public.profiles to service_role;

-- Kullanıcı yalnızca kendi profilini görebilir (onay/aktiflik kontrolü için).
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- Onay/aktiflik alanları kullanıcı tarafından değiştirilemez; yönetici işlemleri
-- service_role ile (RLS baypas) yapılır. Bu yüzden kullanıcıya update policy verilmez.

-- Yeni kullanıcı kaydında profil oluştur. İlk kayıt olan kullanıcı otomatik
-- olarak onaylı + yönetici olur (onaylayıcı hesap); sonrakiler onay bekler.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_count integer;
begin
  select count(*) into existing_count from public.profiles;

  insert into public.profiles (id, email, first_name, last_name, approved, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    (existing_count = 0),
    (existing_count = 0)
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- auth.users e-posta güncellemesini profiles ile senkronla (hearing-crm ile aynı).
create or replace function public.handle_auth_user_email_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email, updated_at = now() where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
  after update on auth.users
  for each row execute function public.handle_auth_user_email_update();
