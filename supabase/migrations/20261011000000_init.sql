-- LIT Church: initial schema (Phase 1: Welcome + intake)
-- Public forms insert via the anon/publishable key. Only staff can read.

create extension if not exists pgcrypto;

-- ── Roles & profiles ────────────────────────────────────────────────────
create type public.app_role as enum
  ('member', 'evangelist', 'followup', 'cell_leader', 'media', 'elder', 'admin');

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  phone text,
  language text not null default 'en' check (language in ('en', 'bem')),
  role public.app_role not null default 'member',
  created_at timestamptz not null default now()
);

create or replace function public.has_role(roles public.app_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = any(roles));
$$;

-- ── People & journey (shared core for visits, salvation, outreach) ──────
create table public.people (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles on delete set null,
  name text not null check (char_length(name) between 2 and 100),
  phone text check (char_length(phone) <= 20),
  area text check (char_length(area) <= 80),
  language text not null default 'en' check (language in ('en', 'bem')),
  source text not null check (source in ('plan_a_visit', 'know_jesus', 'street_outreach', 'online', 'walk_in')),
  referral_code text check (char_length(referral_code) <= 20),
  consent_at timestamptz not null,               -- Data Protection Act 2021: explicit consent
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table public.journey_events (
  id bigint generated always as identity primary key,
  person_id uuid not null references public.people on delete cascade,
  type text not null check (type in (
    'visit_planned', 'gave_life_to_jesus', 'rededicated', 'wants_water_baptism',
    'wants_holy_spirit_prayer', 'has_questions', 'contacted', 'visited', 'attended',
    'baptized_water', 'baptized_holy_spirit', 'joined_cell_group', 'note')),
  payload jsonb not null default '{}'::jsonb check (pg_column_size(payload) < 4000),
  created_by uuid references auth.users,
  created_at timestamptz not null default now()
);
create index on public.journey_events (person_id, created_at desc);

-- ── Follow-up pipeline (assignment happens in staff tools, phase 4) ─────
create table public.followups (
  person_id uuid primary key references public.people on delete cascade,
  assigned_to uuid references public.profiles,
  stage text not null default 'new' check (stage in
    ('new', 'contacted', 'visited', 'attending', 'foundations', 'baptized', 'cell_group', 'closed')),
  due_at timestamptz not null default now() + interval '24 hours',
  last_contact_at timestamptz,
  notes text
);

-- Every new person gets a follow-up row due within 24 hours.
create or replace function public.create_followup()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.followups (person_id) values (new.id) on conflict do nothing;
  return new;
end $$;
create trigger people_followup after insert on public.people
  for each row execute function public.create_followup();

-- ── Prayer ──────────────────────────────────────────────────────────────
create table public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text check (char_length(name) <= 100),
  phone text check (char_length(phone) <= 20),
  category text not null check (category in
    ('salvation', 'healing', 'family', 'work_finances', 'deliverance', 'holy_spirit', 'other')),
  body text not null check (char_length(body) between 5 and 1500),
  visibility text not null default 'team' check (visibility in ('public', 'team', 'private')),
  status text not null default 'open' check (status in ('open', 'praying', 'answered', 'archived')),
  testimony text,
  consent_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ── Cell groups ─────────────────────────────────────────────────────────
create table public.cell_groups (
  id uuid primary key default gen_random_uuid(),
  area text not null unique,
  leader_id uuid references public.profiles,
  meeting_time text,
  active boolean not null default true
);
insert into public.cell_groups (area) values ('Chimwemwe'), ('Riverside'), ('Ndeke'), ('Buchi');

-- ── Devotionals (CMS target; site currently reads src/content) ──────────
create table public.devotionals (
  id uuid primary key default gen_random_uuid(),
  publish_date date not null,
  language text not null default 'en' check (language in ('en', 'bem')),
  title text not null,
  scripture_ref text not null,
  verse_text text,
  reflection text not null,
  prayer text,
  declaration text,
  action text,
  audio_url text,
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'scheduled')),
  author_id uuid references public.profiles,
  approved_by uuid references public.profiles,
  created_at timestamptz not null default now(),
  unique (publish_date, language)
);

-- ── Row Level Security ──────────────────────────────────────────────────
alter table public.profiles        enable row level security;
alter table public.people          enable row level security;
alter table public.journey_events  enable row level security;
alter table public.followups       enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.cell_groups     enable row level security;
alter table public.devotionals     enable row level security;

-- Profiles: users see/update themselves; elders/admins see all.
create policy "own profile" on public.profiles for select using (id = auth.uid() or public.has_role('{elder,admin}'));
create policy "update own profile" on public.profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- Intake: anyone may INSERT (public forms); nobody anonymous can read.
create policy "public intake" on public.people for insert to anon, authenticated
  with check (status = 'new' and profile_id is null);
create policy "public intake" on public.journey_events for insert to anon, authenticated
  with check (created_by is null and type in
    ('visit_planned', 'gave_life_to_jesus', 'rededicated', 'wants_water_baptism', 'wants_holy_spirit_prayer', 'has_questions'));
create policy "public intake" on public.prayer_requests for insert to anon, authenticated
  with check (visibility in ('team', 'private') and status = 'open' and testimony is null);

-- Staff access
create policy "staff read people" on public.people for select
  using (public.has_role('{followup,evangelist,elder,admin}'));
create policy "staff update people" on public.people for update
  using (public.has_role('{followup,elder,admin}'));
create policy "staff read journey" on public.journey_events for select
  using (public.has_role('{followup,evangelist,elder,admin}'));
create policy "staff log journey" on public.journey_events for insert to authenticated
  with check (created_by = auth.uid() and public.has_role('{followup,evangelist,elder,admin}'));
create policy "staff followups" on public.followups for all
  using (public.has_role('{elder,admin}') or assigned_to = auth.uid())
  with check (public.has_role('{elder,admin}') or assigned_to = auth.uid());

-- Private prayer requests: elders/admin only; team requests: prayer team too.
create policy "prayer team read" on public.prayer_requests for select using (
  public.has_role('{elder,admin}') or (visibility = 'team' and public.has_role('{followup}'))
);
create policy "prayer team update" on public.prayer_requests for update using (public.has_role('{elder,admin}'));
create policy "public wall" on public.prayer_requests for select using (visibility = 'public' and status <> 'archived');

create policy "groups readable" on public.cell_groups for select using (active);
create policy "groups managed" on public.cell_groups for all using (public.has_role('{elder,admin}'));

create policy "published devotionals" on public.devotionals for select
  using (status in ('approved', 'scheduled') and publish_date <= (now() at time zone 'Africa/Lusaka')::date
         or public.has_role('{media,elder,admin}'));
create policy "media drafts" on public.devotionals for insert to authenticated
  with check (public.has_role('{media,elder,admin}') and status in ('draft', 'review'));
create policy "media edits" on public.devotionals for update using (public.has_role('{media,elder,admin}'))
  with check (status in ('draft', 'review') or public.has_role('{elder,admin}')); -- only elders approve
