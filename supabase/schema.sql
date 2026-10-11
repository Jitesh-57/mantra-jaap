-- JapSadhna: one row per user holding their mantras, counts and settings.
-- Run this once in Supabase → SQL Editor.

create table if not exists public.mantra_user_data (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  settings   jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.mantra_user_data enable row level security;

-- Each person can only see and change their own row.
drop policy if exists "read own data" on public.mantra_user_data;
create policy "read own data" on public.mantra_user_data
  for select using (auth.uid() = user_id);

drop policy if exists "insert own data" on public.mantra_user_data;
create policy "insert own data" on public.mantra_user_data
  for insert with check (auth.uid() = user_id);

drop policy if exists "update own data" on public.mantra_user_data;
create policy "update own data" on public.mantra_user_data
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "delete own data" on public.mantra_user_data;
create policy "delete own data" on public.mantra_user_data
  for delete using (auth.uid() = user_id);
