-- PostgREST login role (local only). In Supabase this role already exists.
create role authenticator login password 'authenticator' noinherit;
grant anon, authenticated, service_role to authenticator;
