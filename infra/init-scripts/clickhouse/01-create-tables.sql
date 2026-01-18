-- ============================================================================
-- ClickHouse Initialization Script
-- Creates audit log tables for BharatSetu platform
-- ============================================================================

-- Create audit events table
CREATE TABLE IF NOT EXISTS bharatsetu_audit.audit_events
(
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now64(3),
    event_type String,
    service_name String,
    user_id Nullable(String),
    user_role Nullable(String),
    action String,
    resource_type String,
    resource_id Nullable(String),
    request_method String,
    request_path String,
    request_ip String,
    request_user_agent Nullable(String),
    response_status UInt16,
    response_time_ms UInt32,
    metadata String DEFAULT '{}',
    created_at DateTime DEFAULT now()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, service_name, event_type)
TTL timestamp + INTERVAL 1 YEAR
SETTINGS index_granularity = 8192;

-- Create API metrics table
CREATE TABLE IF NOT EXISTS bharatsetu_audit.api_metrics
(
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now64(3),
    service_name String,
    endpoint String,
    method String,
    status_code UInt16,
    response_time_ms UInt32,
    request_size UInt32,
    response_size UInt32,
    user_id Nullable(String),
    error_message Nullable(String)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, service_name, endpoint)
TTL timestamp + INTERVAL 6 MONTH
SETTINGS index_granularity = 8192;

-- Create user activity table
CREATE TABLE IF NOT EXISTS bharatsetu_audit.user_activity
(
    id UUID DEFAULT generateUUIDv4(),
    timestamp DateTime64(3) DEFAULT now64(3),
    user_id String,
    session_id Nullable(String),
    activity_type String,
    service_name String,
    details String DEFAULT '{}',
    ip_address String,
    device_info Nullable(String)
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, user_id, activity_type)
TTL timestamp + INTERVAL 2 YEAR
SETTINGS index_granularity = 8192;

-- Create service health metrics table
CREATE TABLE IF NOT EXISTS bharatsetu_audit.service_health
(
    timestamp DateTime64(3) DEFAULT now64(3),
    service_name String,
    instance_id String,
    cpu_usage Float32,
    memory_usage Float32,
    disk_usage Float32,
    active_connections UInt32,
    request_count UInt32,
    error_count UInt32,
    avg_response_time_ms Float32
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, service_name, instance_id)
TTL timestamp + INTERVAL 3 MONTH
SETTINGS index_granularity = 8192;

-- Create materialized view for hourly API stats
CREATE MATERIALIZED VIEW IF NOT EXISTS bharatsetu_audit.api_stats_hourly
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, service_name, endpoint, method)
AS
SELECT
    toStartOfHour(timestamp) AS hour,
    service_name,
    endpoint,
    method,
    count() AS request_count,
    sum(if(status_code >= 400, 1, 0)) AS error_count,
    avg(response_time_ms) AS avg_response_time,
    max(response_time_ms) AS max_response_time,
    min(response_time_ms) AS min_response_time,
    quantile(0.95)(response_time_ms) AS p95_response_time
FROM bharatsetu_audit.api_metrics
GROUP BY hour, service_name, endpoint, method;

-- Create materialized view for daily user activity
CREATE MATERIALIZED VIEW IF NOT EXISTS bharatsetu_audit.user_activity_daily
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(day)
ORDER BY (day, activity_type, service_name)
AS
SELECT
    toStartOfDay(timestamp) AS day,
    activity_type,
    service_name,
    count() AS activity_count,
    uniqExact(user_id) AS unique_users
FROM bharatsetu_audit.user_activity
GROUP BY day, activity_type, service_name;
