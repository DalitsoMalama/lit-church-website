-- LIT Church: service attendance (QR check-in at the venue)

create table public.attendance (
  id bigint generated always as identity primary key,
  service_date date not null,
  service text not null default 'Sunday Service' check (char_length(service) <= 60),
  name text not null check (char_length(name) between 2 and 100),
  phone text not null check (char_length(phone) between 9 and 20),
  first_time boolean not null default false,
  adults smallint not null default 1 check (adults between 1 and 20),   -- includes the person checking in
  children smallint not null default 0 check (children between 0 and 20),
  area text check (char_length(area) <= 80),
  heard_from text check (heard_from in ('street_outreach', 'friend_family', 'whatsapp', 'social_media', 'passing_by', 'other')),
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (service_date, service, phone)                                 -- one check-in per phone per service
);
create index on public.attendance (service_date desc);

alter table public.attendance enable row level security;

-- Anyone may check in, but only for today's date in Zambia (no back-dating). Nobody anonymous can read.
create policy "public check-in" on public.attendance for insert to anon, authenticated
  with check (service_date = (now() at time zone 'Africa/Lusaka')::date);

create policy "staff read attendance" on public.attendance for select
  using (public.has_role('{followup,elder,admin}'));

-- Link check-ins to the people/journey timeline so first-timers get followed up.
create or replace function public.link_attendance()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  pid uuid;
begin
  select id into pid from public.people where phone = new.phone order by created_at limit 1;
  if pid is null then
    insert into public.people (name, phone, area, source, consent_at)
    values (new.name, new.phone, new.area, 'walk_in', new.consent_at)
    returning id into pid;                          -- people trigger also creates a follow-up due in 24h
  end if;
  insert into public.journey_events (person_id, type, payload)
  values (pid, 'attended', jsonb_build_object(
    'service', new.service, 'date', new.service_date, 'first_time', new.first_time,
    'adults', new.adults, 'children', new.children, 'heard_from', new.heard_from));
  return new;
end $$;

create trigger attendance_link after insert on public.attendance
  for each row execute function public.link_attendance();

-- Headcount per service for the attendance report.
create view public.attendance_summary with (security_invoker = true) as
select
  service_date,
  service,
  count(*)                                   as check_ins,
  sum(adults)::int                           as adults,
  sum(children)::int                         as children,
  sum(adults + children)::int                as total_people,
  count(*) filter (where first_time)         as first_timers
from public.attendance
group by service_date, service
order by service_date desc;
