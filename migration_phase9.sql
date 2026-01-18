-- Convert DEPARTMENT_ADMIN to SERVICE_PROVIDER
UPDATE users
SET roles = 'SERVICE_PROVIDER'
WHERE roles = 'DEPARTMENT_ADMIN';

-- Handle array-based roles
UPDATE users
SET roles = array_replace(roles::text[], 'DEPARTMENT_ADMIN', 'SERVICE_PROVIDER')
WHERE 'DEPARTMENT_ADMIN' = ANY(roles::text[]);

-- Verify admin user exists
INSERT INTO users (id, email, mobile, roles, full_name, mobile_verified, created_at, updated_at)
VALUES (
  'ff41e714-f8d1-41c5-ae3b-601c7aec982b',
  'admin@dpi.com',
  '+919999999999',
  '{PLATFORM_ADMIN}',
  'Platform Administrator',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET roles = '{PLATFORM_ADMIN}';
