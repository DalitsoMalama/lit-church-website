#!/usr/bin/env bash
# Runs the row-level-security attack tests against a throwaway Postgres in Docker.
# Usage: bash supabase/tests/run.sh      (from the project root)
set -euo pipefail
docker run -d --rm --name lit-rls-test -e POSTGRES_PASSWORD=test postgres:16-alpine >/dev/null
trap 'docker stop lit-rls-test >/dev/null' EXIT
until docker exec lit-rls-test pg_isready -U postgres >/dev/null 2>&1; do sleep 1; done
cat supabase/tests/00_supabase_stub.sql supabase/migrations/*.sql | docker exec -i lit-rls-test psql -U postgres -v ON_ERROR_STOP=1 -q
docker exec -i lit-rls-test psql -U postgres -v ON_ERROR_STOP=0 < supabase/tests/rls_attack_tests.sql
