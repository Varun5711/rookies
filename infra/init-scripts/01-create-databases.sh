#!/bin/bash
# ============================================================================
# PostgreSQL Initialization Script
# Creates all required databases for BharatSetu platform
# ============================================================================

set -e

echo "Creating databases for BharatSetu platform..."

# Create databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    -- Auth Service Database
    CREATE DATABASE bharatsetu_auth;
    
    -- Healthcare Service Database
    CREATE DATABASE bharatsetu_healthcare;
    
    -- Agriculture Service Database
    CREATE DATABASE bharatsetu_agriculture;
    
    -- Urban Service Database
    CREATE DATABASE bharatsetu_urban;
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE bharatsetu_auth TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE bharatsetu_healthcare TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE bharatsetu_agriculture TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE bharatsetu_urban TO $POSTGRES_USER;
EOSQL

echo "All databases created successfully!"
