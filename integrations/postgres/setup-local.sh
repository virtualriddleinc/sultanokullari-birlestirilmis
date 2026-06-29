#!/usr/bin/env bash
# Yerel Homebrew Postgres için payload rolü ve veritabanını oluşturur.
# Docker kullanılamadığında: bash integrations/postgres/setup-local.sh

set -euo pipefail

PSQL="${PSQL:-/opt/homebrew/opt/postgresql@16/bin/psql}"

if [[ ! -x "$PSQL" ]]; then
  echo "psql bulunamadı. PSQL ortam değişkenini ayarlayın veya PostgreSQL kurun."
  exit 1
fi

"$PSQL" -h 127.0.0.1 -p 5432 -d postgres <<'SQL'
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'payload') THEN
    CREATE ROLE payload WITH LOGIN PASSWORD 'payload' CREATEDB;
  END IF;
END
$$;
SQL

if ! "$PSQL" -h 127.0.0.1 -p 5432 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = 'sultanokullari'" | grep -q 1; then
  "$PSQL" -h 127.0.0.1 -p 5432 -d postgres -c "CREATE DATABASE sultanokullari OWNER payload;"
  echo "Veritabanı oluşturuldu: sultanokullari"
else
  echo "Veritabanı zaten mevcut: sultanokullari"
fi

echo "Tamam. .env.local içindeki DATABASE_URL ile uyumlu."
