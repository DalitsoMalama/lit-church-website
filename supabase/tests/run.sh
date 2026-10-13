#!/usr/bin/env bash
# Runs the row-level-security attack tests against a throwaway Postgres in Docker.
# Usage: bash supabase/tests/run.sh      (from the project root)
set -euo pipefail
docker run -d --rm --name lit-rls-test -e POSTGRES_PASSWORD=test postgres:16-alpine >/dev/null
trap 'docker stop lit-rls-test >/dev/null' EXIT
# Wait on TCP (-h 127.0.0.1): during first-run setup Postgres starts a temporary server that only
# listens on its Unix socket, reports "ready", then restarts. The real server is the one on TCP.
for _ in $(seq 1 60); do
  docker exec lit-rls-test pg_isready -h 127.0.0.1 -U postgres >/dev/null 2>&1 && break
  sleep 1
done
psql() { docker exec -i lit-rls-test psql -h 127.0.0.1 -U postgres "$@"; }
cat supabase/tests/00_supabase_stub.sql supabase/migrations/*.sql | psql -v ON_ERROR_STOP=1 -q
psql -v ON_ERROR_STOP=0 < supabase/tests/rls_attack_tests.sql
