#!/bin/sh
# Runs every migration in order the first time the local database is created.
set -e
for f in /migrations/*.sql; do
  echo "Applying $f"
  psql -v ON_ERROR_STOP=1 -U postgres -d postgres -q -f "$f"
done
