-- Make all services public (bypasses role checks)
UPDATE registered_services SET is_public = true;
