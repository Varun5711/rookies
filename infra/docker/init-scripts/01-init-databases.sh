#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE ingenium_auth;
    CREATE DATABASE ingenium_registry;
    CREATE DATABASE ingenium_healthcare;
    CREATE DATABASE ingenium_agriculture;
    CREATE DATABASE ingenium_urban;
    CREATE DATABASE ingenium_audit;

    GRANT ALL PRIVILEGES ON DATABASE ingenium_auth TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE ingenium_registry TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE ingenium_healthcare TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE ingenium_agriculture TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE ingenium_urban TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE ingenium_audit TO $POSTGRES_USER;
EOSQL

echo "✅ All service databases created successfully"
