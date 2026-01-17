-- Create audit_logs table for event tracking
CREATE TABLE IF NOT EXISTS ingenium_audit.audit_logs
(
    id UUID DEFAULT generateUUIDv4(),
    event_type String,
    service_name String,
    user_id Nullable(String),
    correlation_id Nullable(String),
    event_data String,
    timestamp DateTime64(3) DEFAULT now64(3),
    date Date DEFAULT toDate(timestamp),

    INDEX idx_event_type event_type TYPE bloom_filter GRANULARITY 1,
    INDEX idx_service_name service_name TYPE bloom_filter GRANULARITY 1,
    INDEX idx_user_id user_id TYPE bloom_filter GRANULARITY 1
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, timestamp)
TTL date + INTERVAL 90 DAY
SETTINGS index_granularity = 8192;

-- Create materialized view for event counts by service
CREATE MATERIALIZED VIEW IF NOT EXISTS ingenium_audit.event_counts_by_service
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, service_name, event_type)
AS SELECT
    toDate(timestamp) as date,
    service_name,
    event_type,
    count() as event_count
FROM ingenium_audit.audit_logs
GROUP BY date, service_name, event_type;

-- Create materialized view for user activity
CREATE MATERIALIZED VIEW IF NOT EXISTS ingenium_audit.user_activity
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, user_id, service_name)
AS SELECT
    toDate(timestamp) as date,
    user_id,
    service_name,
    event_type,
    count() as action_count
FROM ingenium_audit.audit_logs
WHERE user_id IS NOT NULL
GROUP BY date, user_id, service_name, event_type;
