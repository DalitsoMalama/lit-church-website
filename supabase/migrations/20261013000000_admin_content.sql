-- LIT Church: content edited from the admin side (/admin)

-- ── Church details (one row; JSON so new fields need no migration) ────
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 20000),
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1);

-- ── Sermons ───────────────────────────────────────────────────────────
create table public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 150),
  series text check (char_length(series) <= 100),
  speaker text not null check (char_length(speaker) between 2 and 100),
  preached_on date not null,
  scripture text check (char_length(scripture) <= 100),
  summary text check (char_length(summary) <= 1000),
  video_url text check (video_url ~ '^https://' and char_length(video_url) <= 300),
  audio_url text check (audio_url ~ '^https://' and char_length(audio_url) <= 300),
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.sermons (preached_on desc);
insert into public.sermons (title, series, speaker, preached_on)
values ('The Revelation of Grace: Part 2', 'The Revelation of Grace', 'Reverend Mwamba', '2026-10-04');

-- ── Devotional series days (edits + approval; site falls back to built-in text) ──
create table public.devotional_days (
  series text not null default 'come-as-you-are' check (char_length(series) <= 60),
  day smallint not null check (day between 1 and 366),
  title text not null check (char_length(title) between 2 and 120),
  scripture_ref text not null check (char_length(scripture_ref) <= 60),
  verse_text text check (char_length(verse_text) <= 1000),
  reflection text not null check (char_length(reflection) between 20 and 4000),
  prayer text check (char_length(prayer) <= 1000),
  declaration text check (char_length(declaration) <= 500),
  action text check (char_length(action) <= 500),
  approved boolean not null default false,
  approved_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (series, day)
);

-- ── Row Level Security: public may read; only staff may write ─────────
alter table public.site_settings   enable row level security;
alter table public.sermons         enable row level security;
alter table public.devotional_days enable row level security;

create policy "public read" on public.site_settings for select using (true);
create policy "staff write" on public.site_settings for all
  using (public.has_role('{elder,admin}')) with check (public.has_role('{elder,admin}'));

create policy "public read published" on public.sermons for select
  using (published or public.has_role('{media,elder,admin}'));
create policy "staff write" on public.sermons for all
  using (public.has_role('{media,elder,admin}')) with check (public.has_role('{media,elder,admin}'));

create policy "public read" on public.devotional_days for select using (true);
create policy "media edit" on public.devotional_days for all
  using (public.has_role('{media,elder,admin}'))
  with check (public.has_role('{elder,admin}') or not approved); -- only elders/admin can approve

-- Ask PostgREST (Supabase's API) to pick up the new tables
notify pgrst, 'reload schema';
