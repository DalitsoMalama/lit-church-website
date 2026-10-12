-- Row-level security attack tests. Each line says what should happen; compare with the output.
-- Run with: bash supabase/tests/run.sh
\set QUIET on
-- seed staff users (as superuser)
insert into auth.users values ('00000000-0000-0000-0000-00000000000e'),('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000d');
insert into public.profiles (id, full_name, role) values
 ('00000000-0000-0000-0000-00000000000e','Elder','elder'),
 ('00000000-0000-0000-0000-00000000000a','Member','member'),
 ('00000000-0000-0000-0000-00000000000d','Media','media');
create or replace function pg_temp.today() returns date language sql as $$ select (now() at time zone 'Africa/Lusaka')::date $$;

\echo '--- ANON ---'
set role anon;
\echo 'T1 expect OK: anon inserts a new person'
insert into people (name, phone, source, consent_at) values ('Visitor One', '+260971111111', 'plan_a_visit', now());
\echo 'T2 expect RLS ERROR: anon inserts person with status member'
insert into people (name, phone, source, consent_at, status) values ('Bad', '+260972222222', 'plan_a_visit', now(), 'member');
\echo 'T3 expect 0: anon reads people'
select count(*) as anon_people_visible from people;
\echo 'T4 expect RLS ERROR: anon forges baptism event'
insert into journey_events (person_id, type) select gen_random_uuid(), 'baptized_water';
\echo 'T5 expect RLS ERROR: anon posts to the PUBLIC prayer wall'
insert into prayer_requests (category, body, visibility, consent_at) values ('other','Please pray','public',now());
\echo 'T6 expect OK: anon private prayer request'
insert into prayer_requests (category, body, visibility, consent_at) values ('healing','Please pray for me','private',now());
\echo 'T7 expect 0: anon reads prayer requests'
select count(*) as anon_prayers_visible from prayer_requests;
\echo 'T8 expect OK: anon checks in today'
insert into attendance (service_date, name, phone, first_time, consent_at) values ((now() at time zone 'Africa/Lusaka')::date, 'Visitor One', '+260971111111', true, now());
\echo 'T9 expect RLS ERROR: anon back-dates a check-in'
insert into attendance (service_date, name, phone, consent_at) values ((now() at time zone 'Africa/Lusaka')::date - 7, 'Ghost', '+260973333333', now());
\echo 'T10 expect UNIQUE ERROR: same phone checks in twice'
insert into attendance (service_date, name, phone, consent_at) values ((now() at time zone 'Africa/Lusaka')::date, 'Visitor One', '+260971111111', now());
\echo 'T11 expect 0 / 0: anon reads attendance + summary'
select (select count(*) from attendance) as att, (select count(*) from attendance_summary) as summary;
\echo 'T12 expect UPDATE 0 / DELETE 0: anon edits/deletes people'
update people set name = 'hacked';
delete from people;
\echo 'T13 expect RLS ERROR: anon creates a followup'
insert into followups (person_id) select gen_random_uuid();
\echo 'T14 expect RLS ERROR: anon creates a profile (role admin)'
insert into profiles (id, role) values (gen_random_uuid(), 'admin');
\echo 'T15 expect RLS ERROR: anon writes a devotional'
insert into devotionals (publish_date, title, scripture_ref, reflection, status) values (now(), 'x', 'John 1:1', 'x', 'approved');
\echo 'T16 expect f: anon has_role(admin)'
select public.has_role('{admin}') as anon_is_admin;
reset role;

\echo '--- TRIGGERS (superuser view) ---'
\echo 'T17 expect people=1 (deduped by phone), events: visit-less attended=1, followups=1'
select (select count(*) from people where phone='+260971111111') as people_rows,
       (select count(*) from journey_events where type='attended') as attended_events,
       (select count(*) from followups) as followups;

\echo '--- MEMBER ---'
set role authenticated; select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000a', false) \g /dev/null
\echo 'T18 expect 0: member reads people'
select count(*) as member_people_visible from people;
\echo 'T19 expect RLS ERROR or UPDATE 0: member promotes self to admin'
update profiles set role = 'admin' where id = auth.uid();
\echo 'T20 expect 0: member reads attendance'
select count(*) from attendance;
reset role;

\echo '--- MEDIA ---'
set role authenticated; select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000d', false) \g /dev/null
\echo 'T21 expect RLS ERROR: media self-approves a devotional'
insert into devotionals (publish_date, title, scripture_ref, reflection, status) values (current_date, 'x', 'John 1:1', 'x', 'approved');
\echo 'T22 expect OK: media drafts a devotional'
insert into devotionals (publish_date, title, scripture_ref, reflection, status) values (current_date, 'Draft', 'John 1:1', 'x', 'draft');
\echo 'T23 expect RLS ERROR: media approves draft'
update devotionals set status = 'approved';
\echo 'T24 expect 0: media reads people'
select count(*) from people;
reset role;

\echo '--- ELDER ---'
set role authenticated; select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000e', false) \g /dev/null
\echo 'T25 expect >=1: elder reads people / attendance / private prayers'
select (select count(*) from people) p, (select count(*) from attendance) a, (select count(*) from prayer_requests) pr;
\echo 'T26 expect UPDATE 1: elder approves devotional'
update devotionals set status = 'approved';
reset role;

\echo '--- ANON again ---'
set role anon; select set_config('request.jwt.claim.sub','', false) \g /dev/null
\echo 'T27 expect 0: anon reads devotional dated today but approved (publish_date=current_date → visible=1 is OK)'
select count(*) from devotionals;
reset role;
